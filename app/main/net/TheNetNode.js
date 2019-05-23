/**
 * The rUN node project is licensed under the Apache license.

 * Copyright 2019 Centrality Investments Limited

 * Licensed under the Apache license, Version 2.0 (the "license"); you may not use this project except in compliance with the license. You may obtain a copy of the license at http://www.apache.org/licences/LICENCE-2.0.

 * Unless required by applicable law or agreed to in writing, software distributed under the licence is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

 * See the licence for the specific language governing permissions and limitations under the licence.
*/

/**
 * The rUN node project includes the following open source components:

 * github.com/input-output-hk/daedalus/blob/develop/source/main/cardano/CardanoNode.js covered by the MIT license.

 * Copyright 2019 Centrality Investments Limited
 * Copyright (c) 2016 IOHK

 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// @flow
import Store from 'electron-store';
import type { ChildProcess, spawn, exec } from 'child_process';
import type { WriteStream } from 'fs';
import { toInteger } from 'lodash';
import waitPort from 'wait-port';
import assert from 'assert';
import fs from 'fs';

import { environment } from 'common/environment';

import type {
  TheNodeState,
  TheNodeRestartOptions,
  TheNodeStatus,
  FaultInjection,
  FaultInjectionIpcRequest,
  FaultInjectionIpcResponse,
  TlsConfig,
} from '../../common/types/theNode.types';
import { TheNodeStates } from '../../common/types/theNode.types';
import { deriveProcessNames, deriveStorageKeys, promisedCondition } from './utils';
import { getProcess } from '../utils/processes';

type Logger = {
  debug: string => void,
  info: string => void,
  error: string => void,
};

type Actions = {
  spawn: spawn,
  exec: exec,
  readFileSync: (path: string) => Buffer,
  createWriteStream: (path: string, options?: Object) => WriteStream,
  broadcastTlsConfig: (config: ?TlsConfig) => void,
  broadcastStateChange: (state: TheNodeState) => void,
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
};

type TheNodeIpcMessage = {
  Started?: Array<any>,
  ReplyPort?: number,
  FInjects?: FaultInjectionIpcResponse,
};

type NodeArgs = Array<string>;

export type ThetNodeConfig = {
  nodePath: string, // Path to theNode executable
  logFilePath: string, // Log file path for thenet
  tlsPath: string, // Path to theNode TLS folder
  nodeArgs: NodeArgs, // Arguments that are used to spwan theNode
  startupTimeout: number, // Milliseconds to wait for theNode to startup
  startupMaxRetries: number, // Maximum number of retries for re-starting then ode
  shutdownTimeout: number, // Milliseconds to wait for theNode to gracefully shutdown
  killTimeout: number, // Milliseconds to wait for theNode to be killed
  updateTimeout: number, // Milliseconds to wait for theNode to update itself
};

const THENODE_UPDATE_EXIT_CODE = 20;
// grab the current network on which App is running
const network = String(environment.network);
const platform = String(environment.platform);
// derive storage keys based on current network
const { PREVIOUS_THENODE_PID } = deriveStorageKeys(network);
// derive  process name based on current platform
const { THENODE_PROCESS_NAME } = deriveProcessNames(platform);
// create store for persisting TheNetNode and App PID's in fs
const store = new Store();

export class TheNetNode {
  /**
   * The config used to spawn theNode
   * @private
   */
  _config: ThetNodeConfig;

  /**
   * The managed theNode child process
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
   * Log file stream for thenode-sl
   * @private
   */
  _theNodeLogFile: WriteStream;

  /**
   * The TLS config that is generated by the theNode
   * on each startup and is broadcasted over ipc channel
   * @private
   */
  _tlsConfig: ?TlsConfig = null;

  /**
   * The current state of the node, used for making decisions
   * when events like process crashes happen.
   *
   * @type {TheNodeState}
   * @private
   */
  _state: TheNodeState = TheNodeStates.STOPPED;

  /**
   * The last saved status of the node, acting as a cache for the
   * frontend to enable faster page reloads.
   *
   * @type {TheNodeStatus}
   * @private
   */
  _status: ?TheNodeStatus = null;

  /**
   * Number of retries to startup the node (without ever reaching running state)
   */
  _startupTries: number = 0;

  /**
   * All faults that have been injected and confirmed by theNode.
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
   * Getter which returns the PID of the child process of theNode
   * @returns {TlsConfig} // I think this returns a number...
   */
  get pid(): ?number {
    return this._node ? this._node.pid : null;
  }

  /**
   * Getter for the current internal state of the node.
   * @returns {TheNodeState}
   */
  get state(): TheNodeState {
    return this._state;
  }

  /**
   * Getter for the cached status of the node.
   * @returns {TheNodeStatus}
   */
  get status(): ?TheNodeStatus {
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
   * Constructs and prepares the TheNetNode instance for life.
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
   * Starts theNode as child process with given config and log file stream.
   * Waits up to `startupTimeout` for the process to connect.
   * Registers ipc listeners for any necessary process lifecycle events.
   * Asks the node to reply with the current port.
   * Transitions into STARTING state.
   *
   * @param config {ThetNodeConfig}
   * @param isForced {boolean}
   * @returns {Promise<void>} resolves if the node could be started, rejects with error otherwise.
   */
  start = async (config: ThetNodeConfig, isForced: boolean = false): Promise<void> => {
    // Guards
    const nodeCanBeStarted = await this._canBeStarted();

    if (!nodeCanBeStarted) {
      return Promise.reject('TheNetNode: Cannot be started.');
    }
    if (this._isUnrecoverable(config) && !isForced) {
      return Promise.reject('TheNetNode: Too many startup retries.');
    }
    // Setup
    const { _log } = this;
    const { nodePath, nodeArgs, startupTimeout } = config;
    const { createWriteStream } = this._actions;
    const newNodeArgs = nodeArgs;
    this._config = config;

    this._startupTries++;
    this._changeToState(TheNodeStates.STARTING);
    _log.info(`TheNetNode#start: trying to start theNode for the ${this._startupTries}. time.`);
    _log.info(`nodePath: ${JSON.stringify(nodePath)}`);
    _log.info(`newNodeArgs: ${JSON.stringify(newNodeArgs)}`);
    _log.info(`startupTimeout: ${JSON.stringify(startupTimeout)}`);

    // check chain file exists, if not change node state to crash, then we can let user select network again
    const chainSpecFile = this._getArgs(newNodeArgs, '--chain');
    _log.info(`chainSpecFile: ${chainSpecFile}`);
    if (chainSpecFile.endsWith('json') && !fs.existsSync(chainSpecFile)) {
      _log.info(`chainSpecFile not exists.`);
      // TODO UI not fully initialize, not able to receive CRASHED state
      this._changeToState(TheNodeStates.CRASHED);
    }

    return new Promise((resolve, reject) => {
      const logFile = createWriteStream(config.logFilePath, { flags: 'a' });
      logFile.on('open', async () => {
        this._theNodeLogFile = logFile;
        // Spawning theNode
        const jsonArgs = JSON.stringify(newNodeArgs);
        _log.debug(`from path: ${nodePath} with args: ${jsonArgs}.`);
        const node = this._spawnNode(nodePath, newNodeArgs, logFile);
        this._node = node;
        try {
          await promisedCondition(() => node.connected, startupTimeout);
          // Setup lifecycle event handlers

          node.on('exit', this._handleTheNetNodeExit);
          node.on('error', this._handleTheNetNodeError);

          // No IPC between Electron App and theNode atm
          // https://stackoverflow.com/questions/27683266/how-do-you-do-interprocess-communication-ipc-in-rust
          // https://medium.com/@NorbertdeLangen/communicating-between-nodejs-processes-4e68be42b917
          // node.on('message', this._handleTheNetNodeMessage);
          // // Request theNode to reply with port
          // node.send({ QueryPort: [] });

          // check app restart status
          // wait for few seconds and check the port is ready to connect
          const params = {
            host: 'localhost',
            port: 9933,
            timeout: 5 * 1000,
          };
          setTimeout(() => {
            waitPort(params)
              .then(open => {
                if (open) {
                  _log.info('The port is now open!');
                  _log.info(this._state);
                  if (this._state === TheNodeStates.STARTING) {
                    this._changeToState(TheNodeStates.RUNNING);
                    // Reset the startup tries when we managed to get the node running
                    this._startupTries = 0;
                  }
                } else {
                  _log.info('The port did not open before the timeout...');
                }
              })
              .catch(err => {
                _log.error(`An unknown error occurred while waiting for the port: ${err}`);
              });
          }, 10 * 1000);

          _log.info(`TheNetNode#start: theNode child process spawned with PID ${node.pid}`);
          resolve();
        } catch (_) {
          reject('TheNetNode#start: Error while spawning theNode.');
        }
      });
    });
  };

  /**
   * Stops theNode, first by disconnecting and waiting up to `shutdownTimeout`
   * for the node to shutdown itself properly. If that doesn't work as expected the
   * node is killed.
   *
   * @returns {Promise<void>} resolves if the node could be stopped, rejects with error otherwise.
   */
  async stop(): Promise<void> {
    const { _node, _log, _config } = this;
    if (await this._isDead()) {
      _log.info('TheNetNode#stop: process is not running anymore.');
      return Promise.resolve();
    }
    _log.info('TheNetNode#stop: disconnecting from theNode process.');
    try {
      if (_node) _node.disconnect();
      this._changeToState(TheNodeStates.STOPPING);
      await this._waitForNodeProcessToExit(_config.shutdownTimeout);
      await this._storeProcessStates();
      this._reset();
      return Promise.resolve();
    } catch (error) {
      _log.info(`TheNetNode#stop: theNode did not stop correctly: ${error}`);
      try {
        await this.kill();
      } catch (killError) {
        return Promise.reject(killError);
      }
    }
  }

  /**
   * Kills theNode and waitsup to `killTimeout` for the node to
   * report the exit message.
   *
   * @returns {Promise<void>} resolves if the node could be killed, rejects with error otherwise.
   */
  kill(): Promise<void> {
    const { _node, _log } = this;
    return new Promise(async (resolve, reject) => {
      if (await this._isDead()) {
        _log.info('TheNetNode#kill: process is already dead.');
        return Promise.resolve();
      }
      try {
        _log.info('TheNetNode#kill: killing theNode process.');
        if (_node) _node.kill();
        await this._waitForTheNodeToExitOrKillIt();
        await this._storeProcessStates();
        this._reset();
        resolve();
      } catch (_) {
        _log.info('TheNetNode#kill: could not kill theNode.');
        await this._storeProcessStates();
        this._reset();
        reject('Could not kill theNode.');
      }
    });
  }

  /**
   * Stops theNode if necessary and starts it again with current config.
   * Optionally the restart can be forced, so that the `maxRestartTries` is ignored.
   *
   * @param isForced {boolean}
   * @returns {Promise<void>} resolves if the node could be restarted, rejects with error otherwise.
   */
  async restart(isForced: boolean = false): Promise<void> {
    const { _log, _config } = this;
    try {
      if (await this._isConnected()) {
        _log.info('TheNetNode#restart: stopping current node.');
        await this.stop();
      }
      _log.info(
        `TheNetNode#restart: restarting node with previous config (isForced: ${isForced.toString()}).`
      );
      await this._waitForTheNodeToExitOrKillIt();
      await this.start(_config, isForced);
    } catch (error) {
      _log.info(`TheNetNode#restart: Could not restart theNode "${error}"`);
      this._changeToState(TheNodeStates.ERRORED);
      return Promise.reject(error);
    }
  }

  /**
   * Stops theNode if necessary and starts it again with custom config.
   *
   * @param isForced
   * @param options
   * @returns {Promise<void>}
   */
  async restartWithOptions(
    isForced: boolean = false,
    options: TheNodeRestartOptions
  ): Promise<void> {
    const { _log, _config } = this;
    const { nodeArgs } = _config;

    assert(_config, '_config missing');
    assert(options, 'options missing');

    // TODO remove/mask --key value
    _log.info(`before ${JSON.stringify(_config)}`);

    if (options.chain) {
      this._removeArgs(nodeArgs, '--chain', 2);
      nodeArgs.push('--chain');
      nodeArgs.push(options.chain);
    }

    if (options.name) {
      this._removeArgs(nodeArgs, '--name', 2);
      nodeArgs.push('--name');
      nodeArgs.push(options.name);
    }

    if (options.isValidatorMode) {
      this._removeArgs(nodeArgs, '--validator', 1);
      this._removeArgs(nodeArgs, '--key', 2);
      nodeArgs.push('--validator');
      nodeArgs.push('--key');
      nodeArgs.push(options.key);
    } else {
      this._removeArgs(nodeArgs, '--validator', 1);
      this._removeArgs(nodeArgs, '--key', 2);
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
   * Kills theNode if it didn't properly update.
   *
   * @returns {Promise<void>} resolves if the node updated, rejects with error otherwise.
   */
  async expectNodeUpdate(): Promise<void> {
    const { _log, _config } = this;
    this._changeToState(TheNodeStates.UPDATING);
    _log.info('TheNetNode: waiting for node to apply update.');
    try {
      await promisedCondition(() => this._state === TheNodeStates.UPDATED, _config.updateTimeout);
      await this._waitForNodeProcessToExit(_config.updateTimeout);
    } catch (error) {
      _log.info('TheNetNode: did not apply update as expected. Killing it.');
      return this.kill();
    }
  }

  /**
   * Sends an ipc message to theNode to inject a specific fault.
   * This is useful for testing certain error cases that cannot be tested
   * with a properly working theNode.
   *
   * Returns a promise that resolves as soon as theNode confirmed the injection.
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
      return Promise.reject(`theNode did not inject the fault "${fault}" correctly.`);
    }
  };

  saveStatus(status: TheNodeStatus) {
    this._status = status;
  }

  // ================================= PRIVATE ===================================

  /**
   * Spawns theNode as child_process in ipc mode writing to given log file
   * @param nodePath {string}
   * @param args {NodeArgs}
   * @param logFile {WriteStream}
   * @returns {ChildProcess}
   * @private
   */
  _spawnNode(nodePath: string, args: NodeArgs, logFile: WriteStream) {
    return this._actions.spawn(nodePath, args, { stdio: ['inherit', logFile, logFile, 'ipc'] });
  }

  /**
   * Handles node ipc messages sent by the theNode process.
   * Updates the tls config where possible and broadcasts it to
   * the outside if it is complete. Transitions into RUNNING state
   * after it broadcasted the tls config (that's the difference between
   * STARTING and RUNNING).
   *
   * @param msg
   * @private
   */
  _handleTheNetNodeMessage = (msg: TheNodeIpcMessage) => {
    if (msg == null) return;
    this._log.info(`TheNetNode: received message: ${JSON.stringify(msg)}`);
    if (msg.ReplyPort != null) this._handleTheNodeReplyPortMessage(msg.ReplyPort);
    if (msg.FInjects != null) this._handleTheNodeFaultInjectionResponse(msg.FInjects);
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
  _handleTheNodeReplyPortMessage = (port: number) => {
    const { _actions } = this;
    const { tlsPath } = this._config;
    this._tlsConfig = {
      ca: _actions.readFileSync(tlsPath + '/client/ca.crt'),
      key: _actions.readFileSync(tlsPath + '/client/client.key'),
      cert: _actions.readFileSync(tlsPath + '/client/client.pem'),
      port,
    };
    if (this._state === TheNodeStates.STARTING) {
      this._changeToState(TheNodeStates.RUNNING);
      this.broadcastTlsConfig();
      // Reset the startup tries when we managed to get the node running
      this._startupTries = 0;
    }
  };

  /**
   * Updates the active, injected faults confirmed by theNode.
   * @param response
   * @private
   */
  _handleTheNodeFaultInjectionResponse = (response: FaultInjectionIpcResponse) => {
    this._log.info(`TheNetNode: the following faults are active\n${JSON.stringify(response)}`);
    this._injectedFaults = response;
  };

  _handleTheNetNodeError = async (error: Error) => {
    const { _log } = this;
    _log.info(`TheNetNode: error: ${error.toString()}`);
    this._changeToState(TheNodeStates.ERRORED);
    this._transitionListeners.onError(error);
    await this.restart();
  };

  _handleTheNetNodeExit = async (code: number, signal: string) => {
    const { _log, _config, _node } = this;
    _log.info(`TheNetNode: says it exited with [${code}, ${signal}]`);
    // We don't know yet what happened but we can be sure theNode is exiting
    if (this._state === TheNodeStates.RUNNING) {
      this._changeToState(TheNodeStates.EXITING);
    }
    try {
      // Before proceeding with exit procedures, wait until the node is really dead.
      await this._waitForNodeProcessToExit(_config.shutdownTimeout);
    } catch (_) {
      _log.error(
        `TheNetNode: sent exit code ${code} but was still running after ${
          _config.shutdownTimeout
        }ms. Killing it now.`
      );
      try {
        if (_node) await this._ensureProcessIsNotRunning(_node.pid, THENODE_PROCESS_NAME);
      } catch (e) {
        _log.info('TheNetNode: did not exit correctly.');
      }
    }
    _log.info(`TheNetNode: process really exited with [${code}, ${signal}]}`);
    // Handle various exit scenarios
    if (this._state === TheNodeStates.STOPPING) {
      this._changeToState(TheNodeStates.STOPPED);
    } else if (this._state === TheNodeStates.UPDATING && code === THENODE_UPDATE_EXIT_CODE) {
      this._changeToState(TheNodeStates.UPDATED);
    } else if (this._isUnrecoverable(_config)) {
      this._changeToState(TheNodeStates.UNRECOVERABLE);
    } else {
      this._changeToState(TheNodeStates.CRASHED, code, signal);
    }
    this._reset();
  };

  _reset = () => {
    if (this._theNodeLogFile) this._theNodeLogFile.end();
    if (this._node) this._node.removeAllListeners();
    this._tlsConfig = null;
  };

  _changeToState(state: TheNodeState, ...args: Array<any>) {
    const { _log, _transitionListeners } = this;
    _log.info(`TheNetNode: transitions to <${state}>`);
    this._state = state;
    this._actions.broadcastStateChange(state);
    switch (state) {
      case TheNodeStates.STARTING:
        return _transitionListeners.onStarting();
      case TheNodeStates.RUNNING:
        return _transitionListeners.onRunning();
      case TheNodeStates.STOPPING:
        return _transitionListeners.onStopping();
      case TheNodeStates.STOPPED:
        return _transitionListeners.onStopped();
      case TheNodeStates.UPDATING:
        return _transitionListeners.onUpdating();
      case TheNodeStates.UPDATED:
        return _transitionListeners.onUpdated();
      case TheNodeStates.CRASHED:
        return _transitionListeners.onCrashed(...args);
      case TheNodeStates.UNRECOVERABLE:
        return _transitionListeners.onUnrecoverable();
      default:
    }
  }

  /**
   * Checks if theNode child_process is connected and can be interacted with
   * @returns {boolean}
   */
  _isConnected = (): boolean => this._node != null && this._node.connected;

  /**
   * Checks if theNode child_process is not running anymore
   * @returns {boolean}
   */
  _isDead = async (): Promise<boolean> =>
    !this._isConnected() && (await this._isNodeProcessNotRunningAnymore());

  /**
   * Checks if current theNode child_process is "awake" (created, connected, stateful)
   * If node is already awake, returns false.
   * Kills process with PID that matches PID of the previously running
   * theNode child_process that didn't shut down properly
   * @returns {boolean}
   * @private
   */
  _canBeStarted = async (): Promise<boolean> => {
    if (this._isConnected()) {
      return false;
    }
    try {
      await this._ensurePreviousTheNetNodeIsNotRunning();
      return true;
    } catch (error) {
      return false;
    }
  };

  _ensureProcessIsNotRunning = async (pid: number, name: string) => {
    const { _log } = this;
    _log.info(`TheNetNode: checking if ${name} process (PID: ${pid}) is still running`);
    if (await this._isProcessRunning(pid, name)) {
      _log.info(`TheNetNode: killing ${name} process (PID: ${pid})`);
      try {
        await this._killProcessWithName(pid, name);
        return Promise.resolve();
      } catch (error) {
        _log.info(`TheNetNode: could not kill ${name} process (PID: ${pid})`);
        return Promise.reject();
      }
    }
    this._log.info(`No ${name} process (PID: ${pid}) is running.`);
  };

  _ensureCurrentTheNetNodeIsNotRunning = async (): Promise<void> => {
    const { _log, _node } = this;
    _log.info('TheNetNode: checking if current theNode process is still running');
    if (_node == null) {
      return Promise.resolve();
    }
    return await this._ensureProcessIsNotRunning(_node.pid, THENODE_PROCESS_NAME);
  };

  _ensurePreviousTheNetNodeIsNotRunning = async (): Promise<void> => {
    const { _log } = this;
    _log.info('TheNetNode: checking if previous theNode process is still running');
    const previousPID: ?number = await this._retrieveData(PREVIOUS_THENODE_PID);
    if (previousPID == null) {
      return Promise.resolve();
    }
    return await this._ensureProcessIsNotRunning(previousPID, THENODE_PROCESS_NAME);
  };

  _isProcessRunning = async (previousPID: number, processName: string): Promise<boolean> => {
    const { _log } = this;
    try {
      const previousProcess = await getProcess(previousPID, processName);
      if (!previousProcess) {
        _log.debug(`TheNetNode: No previous ${processName} process is running anymore.`);
        return false;
      }
      _log.debug(
        `TheNetNode: previous ${processName} process found: ${JSON.stringify(previousProcess)}`
      );
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
        this._log.info('TheNetNode: using "process.kill(pid)" to kill.');
        process.kill(pid);
      } else {
        // https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/taskkill
        const windowsKillCmd = `taskkill /pid ${pid} /t /f`;
        this._log.info(`TheNetNode (Windows): using "${windowsKillCmd}" to kill.`);
        this._actions.exec(windowsKillCmd);
      }
      await promisedCondition(
        async () => (await this._isProcessRunning(pid, name)) === false,
        _config.killTimeout
      );

      this._log.info(`TheNetNode: successfuly killed ${name} process (PID: ${pid})`);
      return Promise.resolve();
    } catch (error) {
      this._log.info(
        `TheNetNode: _killProcessWithName returned an error attempting to kill ${name}
        process (PID: ${pid}). Error: ${JSON.stringify(error)}`
      );
      return Promise.reject(error);
    }
  };

  async _storeProcessStates() {
    const { _log } = this;
    if (this._node != null) {
      const { pid } = this._node;
      _log.info(`TheNetNode: storing last theNode PID: ${pid}`);
      await this._storeData(PREVIOUS_THENODE_PID, pid);
    }
  }

  // stores the current port/pid on which theNode or App is running
  _storeData = (identifier: string, data: number): Promise<void> =>
    new Promise((resolve, reject) => {
      try {
        // saves current port/pid in file system
        store.set(identifier, data);
        this._log.info(`TheNetNode: ${identifier} stored successfuly`);
        resolve();
      } catch (error) {
        this._log.info(
          `TheNetNode: failed to store ${identifier}. Error: ${JSON.stringify(error)}`
        );
        reject(error);
      }
    });

  // retrieves the last known port/pid on which theNode or App was running
  _retrieveData = (identifier: string): Promise<?number> =>
    new Promise((resolve, reject) => {
      try {
        // retrieves previous port/pid from file system
        const data: ?number = store.get(identifier);

        if (!data) {
          this._log.info(`TheNetNode: get ${identifier} returned null`);
          resolve(null);
        }

        this._log.info(`TheNetNode: get ${identifier} success: ${JSON.stringify(data)}`);
        resolve(toInteger(data));
      } catch (error) {
        this._log.info(`TheNetNode: get ${identifier} failed. Error: ${JSON.stringify(error)}`);
        reject(error);
      }
    });

  _isNodeProcessStillRunning = async (): Promise<boolean> =>
    this._node != null && (await this._isProcessRunning(this._node.pid, THENODE_PROCESS_NAME));

  _isNodeProcessNotRunningAnymore = async () => (await this._isNodeProcessStillRunning()) === false;

  _waitForNodeProcessToExit = async (timeout: number) =>
    await promisedCondition(this._isNodeProcessNotRunningAnymore, timeout);

  _waitForTheNodeToExitOrKillIt = async () => {
    const { _config } = this;
    if (this._isNodeProcessNotRunningAnymore()) return Promise.resolve();
    try {
      await this._waitForNodeProcessToExit(_config.shutdownTimeout);
    } catch (_) {
      await this._ensureCurrentTheNetNodeIsNotRunning();
    }
  };

  _isUnrecoverable = (config: ThetNodeConfig) => this._startupTries >= config.startupMaxRetries;

  _removeArgs = (nodeArgs, argName, space) => {
    const argIndex = nodeArgs.findIndex(item => item === argName);
    if (argIndex >= 0) {
      nodeArgs.splice(argIndex, space);
    }
  };

  _getArgs = (nodeArgs, argName) => {
    const argIndex = nodeArgs.findIndex(item => item === argName);
    if (argIndex >= 0) {
      return nodeArgs[argIndex + 1];
    }
    return null;
  };
}
