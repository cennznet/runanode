// @flow
import Store from 'electron-store';
import type { ChildProcess, spawn, exec } from 'child_process';
import type { WriteStream } from 'fs';
import { toInteger } from 'lodash';
import { environment } from '../environment';
import type {
  CennzNetNodeState, CennzNetRestartOptions,
  CennzNetStatus,
  FaultInjection,
  FaultInjectionIpcRequest,
  FaultInjectionIpcResponse,
  TlsConfig,
} from '../../common/types/cennznet-node.types';
import { CennzNetNodeStates } from '../../common/types/cennznet-node.types';
import { deriveProcessNames, deriveStorageKeys, promisedCondition } from './utils';
import { getProcess } from '../utils/processes';

type Logger = {
  debug: (string) => void,
  info: (string) => void,
  error: (string) => void,
};

type Actions = {
  spawn: spawn,
  exec: exec,
  readFileSync: (path: string) => Buffer,
  createWriteStream: (path: string, options?: Object) => WriteStream,
  broadcastTlsConfig: (config: ?TlsConfig) => void,
  broadcastStateChange: (state: CennzNetNodeState) => void,
};

type StateTransitions = {
  onStarting: () => void,
  onRunning: () => void,
  onStopping: () => void,
  onStopped: () => void,
  onUpdating: () => void,
  onUpdated: () => void,
  onCrashed: (code: number, signal: string) => void,
  onError: (error: Error) => void,
  onUnrecoverable: () => void,
}

type CennzNetNodeIpcMessage = {
  Started?: Array<any>,
  ReplyPort?: number,
  FInjects?: FaultInjectionIpcResponse,
}

type NodeArgs = Array<string>;

export type CennzNetNodeConfig = {
  nodePath: string, // Path to cennznet-node executable
  logFilePath: string, // Log file path for cennznet-sl
  tlsPath: string, // Path to cennznet-node TLS folder
  nodeArgs: NodeArgs, // Arguments that are used to spwan cennznet-node
  startupTimeout: number, // Milliseconds to wait for cennznet-node to startup
  startupMaxRetries: number, // Maximum number of retries for re-starting then ode
  shutdownTimeout: number, // Milliseconds to wait for cennznet-node to gracefully shutdown
  killTimeout: number, // Milliseconds to wait for cennznet-node to be killed
  updateTimeout: number, // Milliseconds to wait for cennznet-node to update itself
};

const CENNZNET_UPDATE_EXIT_CODE = 20;
// grab the current network on which Odin is running
const network = String(environment.network);
const platform = String(environment.platform);
// derive storage keys based on current network
const { PREVIOUS_CENNZNET_PID } = deriveStorageKeys(network);
// derive CennzNet process name based on current platform
const { CENNZNET_PROCESS_NAME } = deriveProcessNames(platform);
// create store for persisting CennzNetNode and Odin PID's in fs
const store = new Store();

export class CennzNetNode {
  /**
   * The config used to spawn cennznet-node
   * @private
   */
  _config: CennzNetNodeConfig;

  /**
   * The managed cennznet-node child process
   * @private
   */
  _node: ?ChildProcess;

  /**
   * The ipc channel used for broadcasting messages to the outside world
   * @private
   */
  _actions: Actions;

  /**
   * The ipc channel used for broadcasting messages to the outside world
   * @private
   */
  _transitionListeners: StateTransitions;

  /**
   * Logger instance to print debug messages to
   * @private
   */
  _log: Logger;

  /**
   * Log file stream for cennznet-sl
   * @private
   */
  _cennznetLogFile: WriteStream;

  /**
   * The TLS config that is generated by the cennznet-node
   * on each startup and is broadcasted over ipc channel
   * @private
   */
  _tlsConfig: ?TlsConfig = null;

  /**
   * The current state of the node, used for making decisions
   * when events like process crashes happen.
   *
   * @type {CennzNetNodeState}
   * @private
   */
  _state: CennzNetNodeState = CennzNetNodeStates.STOPPED;

  /**
   * The last saved status of cennznet node, acting as a cache for the
   * frontend to enable faster page reloads.
   *
   * @type {CennzNetStatus}
   * @private
   */
  _status: ?CennzNetStatus = null;

  /**
   * Number of retries to startup the node (without ever reaching running state)
   */
  _startupTries: number = 0;

  /**
   * All faults that have been injected and confirmed by cennznet-node.
   * These faults can be used during testing to trigger faulty behavior
   * that would not be testable with a correctly working node.
   *
   * @type {Array}
   * @private
   */
  _injectedFaults: Array<FaultInjection> = [];

  /**
   * Getter which copies and returns the internal tls config.
   * @returns {TlsConfig}
   */
  get tlsConfig(): TlsConfig {
    return Object.assign({}, this._tlsConfig);
  }

  /**
   * Getter which returns the PID of the child process of cennznet-node
   * @returns {TlsConfig} // I think this returns a number...
   */
  get pid(): ?number {
    return this._node ? this._node.pid : null;
  }

  /**
   * Getter for the current internal state of the node.
   * @returns {CennzNetNodeState}
   */
  get state(): CennzNetNodeState {
    return this._state;
  }

  /**
   * Getter for the cached status of the node.
   * @returns {CennzNetStatus}
   */
  get status(): ?CennzNetStatus {
    return this._status;
  }

  /**
   * Getter for the number of tried (and failed) startups
   * @returns {number}
   */
  get startupTries(): number {
    return this._startupTries;
  }

  /**
   * Constructs and prepares the CennzNetNode instance for life.
   * @param log
   * @param actions
   * @param transitions
   */
  constructor(log: Logger, actions: Actions, transitions: StateTransitions) {
    this._log = log;
    this._actions = actions;
    this._transitionListeners = transitions;
  }

  /**
   * Starts cennznet-node as child process with given config and log file stream.
   * Waits up to `startupTimeout` for the process to connect.
   * Registers ipc listeners for any necessary process lifecycle events.
   * Asks the node to reply with the current port.
   * Transitions into STARTING state.
   *
   * @param config {CennzNetNodeConfig}
   * @param isForced {boolean}
   * @returns {Promise<void>} resolves if the node could be started, rejects with error otherwise.
   */
  start = async (config: CennzNetNodeConfig, isForced: boolean = false): Promise<void> => {
    // Guards
    const nodeCanBeStarted = await this._canBeStarted();

    if (!nodeCanBeStarted) {
      return Promise.reject('CennzNetNode: Cannot be started.');
    }
    if (this._isUnrecoverable(config) && !isForced) {
      return Promise.reject('CennzNetNode: Too many startup retries.');
    }
    // Setup
    const { _log } = this;
    const { nodePath, nodeArgs, startupTimeout } = config;
    const { createWriteStream } = this._actions;
    const newNodeArgs = nodeArgs;
    this._config = config;

    this._startupTries++;
    this._changeToState(CennzNetNodeStates.STARTING);
    _log.info(`CennzNetNode#start: trying to start cennznet-node for the ${this._startupTries}. time.`);

    return new Promise((resolve, reject) => {
      const logFile = createWriteStream(config.logFilePath, { flags: 'a' });
      logFile.on('open', async () => {
        this._cennznetLogFile = logFile;
        // Spawning cennznet-node
        const jsonArgs = JSON.stringify(newNodeArgs);
        _log.debug(`from path: ${nodePath} with args: ${jsonArgs}.`);
        const node = this._spawnNode(nodePath, newNodeArgs, logFile);
        this._node = node;
        try {
          await promisedCondition(() => node.connected, startupTimeout);
          // Setup livecycle event handlers
          node.on('message', this._handleCennzNetNodeMessage);
          node.on('exit', this._handleCennzNetNodeExit);
          node.on('error', this._handleCennzNetNodeError);
          // Request cennznet-node to reply with port
          node.send({ QueryPort: [] });
          _log.info(`CennzNetNode#start: cennznet-node child process spawned with PID ${node.pid}`);
          resolve();
        } catch (_) {
          reject('CennzNetNode#start: Error while spawning cennznet-node.');
        }
      });
    });
  };

  /**
   * Stops cennznet-node, first by disconnecting and waiting up to `shutdownTimeout`
   * for the node to shutdown itself properly. If that doesn't work as expected the
   * node is killed.
   *
   * @returns {Promise<void>} resolves if the node could be stopped, rejects with error otherwise.
   */
  async stop(): Promise<void> {
    const { _node, _log, _config } = this;
    if (await this._isDead()) {
      _log.info('CennzNetNode#stop: process is not running anymore.');
      return Promise.resolve();
    }
    _log.info('CennzNetNode#stop: disconnecting from cennznet-node process.');
    try {
      if (_node) _node.disconnect();
      this._changeToState(CennzNetNodeStates.STOPPING);
      await this._waitForNodeProcessToExit(_config.shutdownTimeout);
      await this._storeProcessStates();
      this._reset();
      return Promise.resolve();
    } catch (error) {
      _log.info(`CennzNetNode#stop: cennznet-node did not stop correctly: ${error}`);
      try {
        await this.kill();
      } catch (killError) {
        return Promise.reject(killError);
      }
    }
  }

  /**
   * Kills cennznet-node and waitsup to `killTimeout` for the node to
   * report the exit message.
   *
   * @returns {Promise<void>} resolves if the node could be killed, rejects with error otherwise.
   */
  kill(): Promise<void> {
    const { _node, _log } = this;
    return new Promise(async (resolve, reject) => {
      if (await this._isDead()) {
        _log.info('CennzNetNode#kill: process is already dead.');
        return Promise.resolve();
      }
      try {
        _log.info('CennzNetNode#kill: killing cennznet-node process.');
        if (_node) _node.kill();
        await this._waitForCennzNetToExitOrKillIt();
        await this._storeProcessStates();
        this._reset();
        resolve();
      } catch (_) {
        _log.info('CennzNetNode#kill: could not kill cennznet-node.');
        await this._storeProcessStates();
        this._reset();
        reject('Could not kill cennznet-node.');
      }
    });
  }

  /**
   * Stops cennznet-node if necessary and starts it again with current config.
   * Optionally the restart can be forced, so that the `maxRestartTries` is ignored.
   *
   * @param isForced {boolean}
   * @returns {Promise<void>} resolves if the node could be restarted, rejects with error otherwise.
   */
  async restart(isForced: boolean = false): Promise<void> {
    const { _log, _config } = this;
    try {
      // Stop cennznet nicely if it is still awake
      if (await this._isConnected()) {
        _log.info('CennzNetNode#restart: stopping current node.');
        await this.stop();
      }
      _log.info(`CennzNetNode#restart: restarting node with previous config (isForced: ${isForced.toString()}).`);
      await this._waitForCennzNetToExitOrKillIt();
      await this.start(_config, isForced);
    } catch (error) {
      _log.info(`CennzNetNode#restart: Could not restart cennznet-node "${error}"`);
      this._changeToState(CennzNetNodeStates.ERRORED);
      return Promise.reject(error);
    }
  }

  /**
   * Stops cennznet-node if necessary and starts it again with custom config.
   *
   * @param isForced
   * @param options
   * @returns {Promise<void>}
   */
  async restartWithOptions(isForced: boolean = false, options: CennzNetRestartOptions): Promise<void> {
    const { _log, _config } = this;
    const { nodeArgs } = _config;
    _log.info(`before ${JSON.stringify(_config)}`);
    if(options.chain) {
      // remove existing config
      const chainArgIndex = nodeArgs.findIndex((item) => item === '--chain');
      if(chainArgIndex>=0) {
        nodeArgs.splice(chainArgIndex, 2);
      }
      nodeArgs.push('--chain');
      nodeArgs.push(options.chain);
    }
    if(options.name) {
      // remove existing config
      const chainArgIndex = nodeArgs.findIndex((item) => item === '--name');
      if(chainArgIndex>=0) {
        nodeArgs.splice(chainArgIndex, 2);
      }
      nodeArgs.push('--name');
      nodeArgs.push(options.name);
    }
    _log.info(`after ${JSON.stringify(_config)}`);
    return await this.restart(isForced);
  }

  /**
   * Uses the configured action to broadcast the tls config
   */
  broadcastTlsConfig() {
    this._actions.broadcastTlsConfig(this._tlsConfig);
  }

  /**
   * Changes the internal state to UPDATING.
   * Waits up to the configured `updateTimeout` for the UPDATED state.
   * Kills cennznet-node if it didn't properly update.
   *
   * @returns {Promise<void>} resolves if the node updated, rejects with error otherwise.
   */
  async expectNodeUpdate(): Promise<void> {
    const { _log, _config } = this;
    this._changeToState(CennzNetNodeStates.UPDATING);
    _log.info('CennzNetNode: waiting for node to apply update.');
    try {
      await promisedCondition(() => (
        this._state === CennzNetNodeStates.UPDATED
      ), _config.updateTimeout);
      await this._waitForNodeProcessToExit(_config.updateTimeout);
    } catch (error) {
      _log.info('CennzNetNode: did not apply update as expected. Killing it.');
      return this.kill();
    }
  }

  /**
   * Sends an ipc message to cennznet-node to inject a specific fault.
   * This is useful for testing certain error cases that cannot be tested
   * with a properly working cennznet-node.
   *
   * Returns a promise that resolves as soon as cennznet-node confirmed the injection.
   *
   * @param request
   * @returns {Promise<void>}
   */
  setFault = async (request: FaultInjectionIpcRequest) => {
    if (!this._node) return;
    const fault = request[0];
    const isEnabled = request[1];
    this._node.send({ SetFInject: request });
    try {
      return await promisedCondition(() => {
        const hasFault = this._injectedFaults.includes(fault);
        return isEnabled ? hasFault : !hasFault;
      });
    } catch (error) {
      return Promise.reject(
        `cennznet-node did not inject the fault "${fault}" correctly.`
      );
    }
  };

  saveStatus(status: CennzNetStatus) {
    this._status = status;
  }

  // ================================= PRIVATE ===================================

  /**
   * Spawns cennznet-node as child_process in ipc mode writing to given log file
   * @param nodePath {string}
   * @param args {NodeArgs}
   * @param logFile {WriteStream}
   * @returns {ChildProcess}
   * @private
   */
  _spawnNode(nodePath: string, args: NodeArgs, logFile: WriteStream) {
    return this._actions.spawn(
      nodePath, args, { stdio: ['inherit', logFile, logFile, 'ipc'] }
    );
  }

  /**
   * Handles node ipc messages sent by the cennznet-node process.
   * Updates the tls config where possible and broadcasts it to
   * the outside if it is complete. Transitions into RUNNING state
   * after it broadcasted the tls config (that's the difference between
   * STARTING and RUNNING).
   *
   * @param msg
   * @private
   */
  _handleCennzNetNodeMessage = (msg: CennzNetNodeIpcMessage) => {
    if (msg == null) return;
    this._log.info(`CennzNetNode: received message: ${JSON.stringify(msg)}`);
    if (msg.ReplyPort != null) this._handleCennzNetReplyPortMessage(msg.ReplyPort);
    if (msg.FInjects != null) this._handleCennzNetFaultInjectionResponse(msg.FInjects);
  };

  /**
   * Reads the tls certificates and uses them together with the given port
   * to set the tls config, which will be used for any http communication
   * with the node.
   *
   * Changes state to RUNNING.
   *
   * @param port
   * @private
   */
  _handleCennzNetReplyPortMessage = (port: number) => {
    const { _actions } = this;
    const { tlsPath } = this._config;
    this._tlsConfig = {
      ca: _actions.readFileSync(tlsPath + '/client/ca.crt'),
      key: _actions.readFileSync(tlsPath + '/client/client.key'),
      cert: _actions.readFileSync(tlsPath + '/client/client.pem'),
      port,
    };
    if (this._state === CennzNetNodeStates.STARTING) {
      this._changeToState(CennzNetNodeStates.RUNNING);
      this.broadcastTlsConfig();
      // Reset the startup tries when we managed to get the node running
      this._startupTries = 0;
    }
  };

  /**
   * Updates the active, injected faults confirmed by cennznet-node.
   * @param response
   * @private
   */
  _handleCennzNetFaultInjectionResponse = (response: FaultInjectionIpcResponse) => {
    this._log.info(`CennzNetNode: the following faults are active\n${JSON.stringify(response)}`);
    this._injectedFaults = response;
  };

  _handleCennzNetNodeError = async (error: Error) => {
    const { _log } = this;
    _log.info(`CennzNetNode: error: ${error.toString()}`);
    this._changeToState(CennzNetNodeStates.ERRORED);
    this._transitionListeners.onError(error);
    await this.restart();
  };

  _handleCennzNetNodeExit = async (code: number, signal: string) => {
    const { _log, _config, _node } = this;
    _log.info(`CennzNetNode: says it exited with [${code}, ${signal}]`);
    // We don't know yet what happened but we can be sure cennznet-node is exiting
    if (this._state === CennzNetNodeStates.RUNNING) {
      this._changeToState(CennzNetNodeStates.EXITING);
    }
    try {
      // Before proceeding with exit procedures, wait until the node is really dead.
      await this._waitForNodeProcessToExit(_config.shutdownTimeout);
    } catch (_) {
      _log.error(`CennzNetNode: sent exit code ${code} but was still running after ${_config.shutdownTimeout}ms. Killing it now.`);
      try {
        if (_node) await this._ensureProcessIsNotRunning(_node.pid, CENNZNET_PROCESS_NAME);
      } catch (e) {
        _log.info('CennzNetNode: did not exit correctly.');
      }
    }
    _log.info(`CennzNetNode: process really exited with [${code}, ${signal}]}`);
    // Handle various exit scenarios
    if (this._state === CennzNetNodeStates.STOPPING) {
      this._changeToState(CennzNetNodeStates.STOPPED);
    } else if (this._state === CennzNetNodeStates.UPDATING && code === CENNZNET_UPDATE_EXIT_CODE) {
      this._changeToState(CennzNetNodeStates.UPDATED);
    } else if (this._isUnrecoverable(_config)) {
      this._changeToState(CennzNetNodeStates.UNRECOVERABLE);
    } else {
      this._changeToState(CennzNetNodeStates.CRASHED, code, signal);
    }
    this._reset();
  };

  _reset = () => {
    if (this._cennznetLogFile) this._cennznetLogFile.end();
    if (this._node) this._node.removeAllListeners();
    this._tlsConfig = null;
  };

  _changeToState(state: CennzNetNodeState, ...args: Array<any>) {
    const { _log, _transitionListeners } = this;
    _log.info(`CennzNetNode: transitions to <${state}>`);
    this._state = state;
    this._actions.broadcastStateChange(state);
    switch (state) {
      case CennzNetNodeStates.STARTING: return _transitionListeners.onStarting();
      case CennzNetNodeStates.RUNNING: return _transitionListeners.onRunning();
      case CennzNetNodeStates.STOPPING: return _transitionListeners.onStopping();
      case CennzNetNodeStates.STOPPED: return _transitionListeners.onStopped();
      case CennzNetNodeStates.UPDATING: return _transitionListeners.onUpdating();
      case CennzNetNodeStates.UPDATED: return _transitionListeners.onUpdated();
      case CennzNetNodeStates.CRASHED: return _transitionListeners.onCrashed(...args);
      case CennzNetNodeStates.UNRECOVERABLE: return _transitionListeners.onUnrecoverable();
      default:
    }
  }

  /**
   * Checks if cennznet-node child_process is connected and can be interacted with
   * @returns {boolean}
   */
  _isConnected = (): boolean => this._node != null && this._node.connected;

  /**
   * Checks if cennznet-node child_process is not running anymore
   * @returns {boolean}
   */
  _isDead = async (): Promise<boolean> => (
    !this._isConnected() && await this._isNodeProcessNotRunningAnymore()
  );

  /**
   * Checks if current cennznet-node child_process is "awake" (created, connected, stateful)
   * If node is already awake, returns false.
   * Kills process with PID that matches PID of the previously running
   * cennznet-node child_process that didn't shut down properly
   * @returns {boolean}
   * @private
   */
  _canBeStarted = async (): Promise<boolean> => {
    if (this._isConnected()) { return false; }
    try {
      await this._ensurePreviousCennzNetNodeIsNotRunning();
      return true;
    } catch (error) {
      return false;
    }
  };

  _ensureProcessIsNotRunning = async (pid: number, name: string) => {
    const { _log } = this;
    _log.info(`CennzNetNode: checking if ${name} process (PID: ${pid}) is still running`);
    if (await this._isProcessRunning(pid, name)) {
      _log.info(`CennzNetNode: killing ${name} process (PID: ${pid})`);
      try {
        await this._killProcessWithName(pid, name);
        return Promise.resolve();
      } catch (error) {
        _log.info(`CennzNetNode: could not kill ${name} process (PID: ${pid})`);
        return Promise.reject();
      }
    }
    this._log.info(`No ${name} process (PID: ${pid}) is running.`);
  };

  _ensureCurrentCennzNetNodeIsNotRunning = async (): Promise<void> => {
    const { _log, _node } = this;
    _log.info('CennzNetNode: checking if current cennznet-node process is still running');
    if (_node == null) { return Promise.resolve(); }
    return await this._ensureProcessIsNotRunning(_node.pid, CENNZNET_PROCESS_NAME);
  };

  _ensurePreviousCennzNetNodeIsNotRunning = async (): Promise<void> => {
    const { _log } = this;
    _log.info('CennzNetNode: checking if previous cennznet-node process is still running');
    const previousPID: ?number = await this._retrieveData(PREVIOUS_CENNZNET_PID);
    if (previousPID == null) { return Promise.resolve(); }
    return await this._ensureProcessIsNotRunning(previousPID, CENNZNET_PROCESS_NAME);
  };

  _isProcessRunning = async (previousPID: number, processName: string): Promise<boolean> => {
    const { _log } = this;
    try {
      const previousProcess = await getProcess(previousPID, processName);
      if (!previousProcess) {
        _log.debug(`CennzNetNode: No previous ${processName} process is running anymore.`);
        return false;
      }
      _log.debug(`CennzNetNode: previous ${processName} process found: ${JSON.stringify(previousProcess)}`);
      return true;
    } catch (error) {
      return false;
    }
  };

  // kills running process which did not shut down properly between sessions
  _killProcessWithName = async (pid: number, name: string): Promise<void> => {
    const { _config } = this;
    try {
      if (!environment.isWindows) {
        this._log.info('CennzNetNode: using "process.kill(pid)" to kill.');
        process.kill(pid);
      } else {
        // https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/taskkill
        const windowsKillCmd = `taskkill /pid ${pid} /t /f`;
        this._log.info(`CennzNetNode (Windows): using "${windowsKillCmd}" to kill.`);
        this._actions.exec(windowsKillCmd);
      }
      await promisedCondition(async () => (
        (await this._isProcessRunning(pid, name)) === false
      ), _config.killTimeout);

      this._log.info(`CennzNetNode: successfuly killed ${name} process (PID: ${pid})`);
      return Promise.resolve();
    } catch (error) {
      this._log.info(
        `CennzNetNode: _killProcessWithName returned an error attempting to kill ${name}
        process (PID: ${pid}). Error: ${JSON.stringify(error)}`
      );
      return Promise.reject(error);
    }
  };

  async _storeProcessStates() {
    const { _log } = this;
    if (this._node != null) {
      const { pid } = this._node;
      _log.info(`CennzNetNode: storing last cennznet-node PID: ${pid}`);
      await this._storeData(PREVIOUS_CENNZNET_PID, pid);
    }
  }

  // stores the current port/pid on which cennznet-node or Odin is running
  _storeData = (identifier: string, data: number): Promise<void> => (
    new Promise((resolve, reject) => {
      try {
        // saves current port/pid in file system
        store.set(identifier, data);
        this._log.info(`CennzNetNode: ${identifier} stored successfuly`);
        resolve();
      } catch (error) {
        this._log.info(`CennzNetNode: failed to store ${identifier}. Error: ${JSON.stringify(error)}`);
        reject(error);
      }
    })
  );

  // retrieves the last known port/pid on which cennznet-node or Odin was running
  _retrieveData = (identifier: string): Promise<?number> => (
    new Promise((resolve, reject) => {
      try {
        // retrieves previous port/pid from file system
        const data: ?number = store.get(identifier);

        if (!data) {
          this._log.info(`CennzNetNode: get ${identifier} returned null`);
          resolve(null);
        }

        this._log.info(`CennzNetNode: get ${identifier} success: ${JSON.stringify(data)}`);
        resolve(toInteger(data));
      } catch (error) {
        this._log.info(`CennzNetNode: get ${identifier} failed. Error: ${JSON.stringify(error)}`);
        reject(error);
      }
    })
  );

  _isNodeProcessStillRunning = async (): Promise<boolean> => (
    this._node != null && await this._isProcessRunning(this._node.pid, CENNZNET_PROCESS_NAME)
  );

  _isNodeProcessNotRunningAnymore = async () => await this._isNodeProcessStillRunning() === false;

  _waitForNodeProcessToExit = async (timeout: number) => (
    await promisedCondition(this._isNodeProcessNotRunningAnymore, timeout)
  );

  _waitForCennzNetToExitOrKillIt = async () => {
    const { _config } = this;
    if (this._isNodeProcessNotRunningAnymore()) return Promise.resolve();
    try {
      await this._waitForNodeProcessToExit(_config.shutdownTimeout);
    } catch (_) {
      await this._ensureCurrentCennzNetNodeIsNotRunning();
    }
  };

  _isUnrecoverable = (config: CennzNetNodeConfig) => (
    this._startupTries >= config.startupMaxRetries
  );
}
