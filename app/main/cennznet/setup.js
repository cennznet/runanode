// @flow
import { createWriteStream, readFileSync } from 'fs';
import { spawn, exec } from 'child_process';
import { BrowserWindow } from 'electron';
import appConfig from 'app/config';

import { Logger, GetCennzNodeLogFileName } from '../utils/logging';
import { prepareArgs } from './cennzNetConfig';
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
  CennzNetRestartOptions,
} from '../../common/types/cennznet-node.types';
import type { LauncherConfig } from '../launcherConfig';

const startCennzNetNode = (node: CennzNetNode, launcherConfig: Object) => {
  const { nodePath, tlsPath, logsPrefix } = launcherConfig;
  const nodeArgs = prepareArgs(launcherConfig);
  const logFilePath = logsPrefix + '/' + GetCennzNodeLogFileName();
  const config = {
    nodePath,
    logFilePath,
    tlsPath,
    nodeArgs,
    startupTimeout: appConfig.node.startupTimeout,
    startupMaxRetries: appConfig.node.startupMaxRetry,
    shutdownTimeout: appConfig.node.shutDownTimeout,
    killTimeout: appConfig.node.killTimeout,
    updateTimeout: appConfig.node.updateTimeout,
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

  // cennznetRestartChannel.onReceive(() => {
  //   Logger.info('ipcMain: Received request from renderer to restart node.');
  //   return cennzNetNode.restart(true); // forced restart
  // });

  cennznetRestartChannel.onReceive((options: CennzNetRestartOptions) => {
    Logger.info(
      `ipcMain: Received request from renderer to restart node. with options: ${JSON.stringify(
        options
      )}`
    );
    return cennzNetNode.restartWithOptions(true, options); // forced restart
  });

  cennznetFaultInjectionChannel.onReceive(fault => {
    Logger.info(`ipcMain: Received request to inject a fault into cennznet node: ${String(fault)}`);
    return cennzNetNode.setFault(fault);
  });

  return cennzNetNode;
};
