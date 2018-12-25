// @flow
import { createWriteStream, readFileSync } from 'fs';
import { spawn, exec } from 'child_process';
import { BrowserWindow } from 'electron';
import { Logger } from '../utils/logging';
import { prepareArgs } from './config';
import { CennzNetNode } from './CennzNetNode';
import {
  cennznetTlsConfigChannel,
  cennznetRestartChannel,
  cennznetAwaitUpdateChannel,
  cennznetStateChangeChannel,
  cennznetFaultInjectionChannel,
  cennznetStatusChannel,
} from '../ipc/cennznet.ipc';
// import { safeExitWithCode } from '../utils/safeExitWithCode';
import type {
  TlsConfig,
  CennzNetNodeState,
  CennzNetStatus,
} from '../../common/types/cennznet-node.types';
import type { LauncherConfig } from '../config';
import {
  NODE_KILL_TIMEOUT,
  NODE_SHUTDOWN_TIMEOUT,
  NODE_STARTUP_MAX_RETRIES,
  NODE_STARTUP_TIMEOUT,
  NODE_UPDATE_TIMEOUT,
} from '../config';

const startCennzNetNode = (node: CennzNetNode, launcherConfig: Object) => {
  const { nodePath, tlsPath, logsPrefix } = launcherConfig;
  const nodeArgs = prepareArgs(launcherConfig);
  const logFilePath = logsPrefix + '/cennznet-node.log';
  const config = {
    nodePath,
    logFilePath,
    tlsPath,
    nodeArgs,
    startupTimeout: NODE_STARTUP_TIMEOUT,
    startupMaxRetries: NODE_STARTUP_MAX_RETRIES,
    shutdownTimeout: NODE_SHUTDOWN_TIMEOUT,
    killTimeout: NODE_KILL_TIMEOUT,
    updateTimeout: NODE_UPDATE_TIMEOUT,
  };
  return node.start(config);
};

const restartCennzNetNode = async (node: CennzNetNode) => {
  try {
    await node.restart();
  } catch (error) {
    Logger.info(`Could not restart CennzNetNode: ${error}`);
  }
};

/**
 * Configures, starts and manages the CennzNetNode responding to node
 * state changes, app events and IPC messages coming from the renderer.
 *
 * @param launcherConfig {LauncherConfig}
 * @param mainWindow
 */
export const setupCennzNet = (
  launcherConfig: LauncherConfig,
  mainWindow: BrowserWindow
): CennzNetNode => {
  const cennzNetNode = new CennzNetNode(
    Logger,
    {
      // Dependencies on node.js apis are passed as props to ease testing
      spawn,
      exec,
      readFileSync,
      createWriteStream,
      broadcastTlsConfig: (config: ?TlsConfig) => {
        if (!mainWindow.isDestroyed()) cennznetTlsConfigChannel.send(config, mainWindow);
      },
      broadcastStateChange: (state: CennzNetNodeState) => {
        if (!mainWindow.isDestroyed()) cennznetStateChangeChannel.send(state, mainWindow);
      },
    },
    {
      // CennzNetNode lifecycle hooks
      onStarting: () => {},
      onRunning: () => {},
      onStopping: () => {},
      onStopped: () => {},
      onUpdating: () => {},
      onUpdated: () => {},
      onCrashed: code => {
        const restartTimeout = cennzNetNode.startupTries > 0 ? 30000 : 0;
        Logger.info(`CennzNetNode crashed with code ${code}. Restarting in ${restartTimeout}ms …`);
        setTimeout(() => restartCennzNetNode(cennzNetNode), restartTimeout);
      },
      onError: () => {},
      onUnrecoverable: () => {},
    }
  );
  startCennzNetNode(cennzNetNode, launcherConfig);

  cennznetStatusChannel.onRequest(() => {
    Logger.info('ipcMain: Received request from renderer for cennznet status.');
    return Promise.resolve(cennzNetNode.status);
  });

  cennznetStatusChannel.onReceive((status: CennzNetStatus) => {
    Logger.info('ipcMain: Received request from renderer to cache cennznet status.');
    cennzNetNode.saveStatus(status);
    return Promise.resolve(cennzNetNode.status);
  });

  cennznetStateChangeChannel.onRequest(() => {
    Logger.info('ipcMain: Received request from renderer for node state.');
    return Promise.resolve(cennzNetNode.state);
  });

  cennznetTlsConfigChannel.onRequest(() => {
    Logger.info('ipcMain: Received request from renderer for tls config.');
    return Promise.resolve(cennzNetNode.tlsConfig);
  });

  cennznetAwaitUpdateChannel.onReceive(() => {
    Logger.info('ipcMain: Received request from renderer to await update.');
    setTimeout(async () => {
      await cennzNetNode.expectNodeUpdate();
      Logger.info('CennzNetNode applied an update. Exiting Odin with code 20.');
      // safeExitWithCode(20);
    });
    return Promise.resolve();
  });

  cennznetRestartChannel.onReceive(() => {
    Logger.info('ipcMain: Received request from renderer to restart node.');
    return cennzNetNode.restart(true); // forced restart
  });

  cennznetFaultInjectionChannel.onReceive(fault => {
    Logger.info(`ipcMain: Received request to inject a fault into cennznet node: ${String(fault)}`);
    return cennzNetNode.setFault(fault);
  });

  return cennzNetNode;
};
