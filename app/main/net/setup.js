/**
 * The rUN node project is licensed under the Apache license.

 * Copyright 2019 Centrality Investments Limited

 * Licensed under the Apache license, Version 2.0 (the "license"); you may not use this project except in compliance with the license. You may obtain a copy of the license at http://www.apache.org/licences/LICENCE-2.0.

 * Unless required by applicable law or agreed to in writing, software distributed under the licence is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

 * See the licence for the specific language governing permissions and limitations under the licence.
*/

/**
 * The rUN node project includes the following open source components:

 * https://github.com/input-output-hk/daedalus/blob/develop/source/main/cardano/setupCardanoNodeMode.js covered by the MIT license.

 * Copyright 2019 Centrality Investments Limited
 * Copyright (c) 2016 IOHK

 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// @flow
import { createWriteStream, readFileSync } from 'fs';
import { spawn, exec } from 'child_process';
import { BrowserWindow } from 'electron';
import appConfig from 'app/config';

import { Logger, GetTheNodeLogFileName } from '../utils/logging';
import { prepareArgs } from './theNodeConfig';
import { TheNetNode } from './TheNetNode';
import {
  theNodeTlsConfigChannel,
  theNodeRestartChannel,
  theNodeAwaitUpdateChannel,
  theNodeStateChangeChannel,
  theNodeFaultInjectionChannel,
  theNodeStatusChannel,
} from '../ipc/theNode.ipc';
// import { safeExitWithCode } from '../utils/safeExitWithCode';
import type {
  TlsConfig,
  TheNodeState,
  TheNodeStatus,
  TheNodeRestartOptions,
} from '../../common/types/theNode.types';
import type { LauncherConfig } from '../launcherConfig';

const startTheNetNode = (node: TheNetNode, launcherConfig: Object) => {
  const { nodePath, tlsPath, logsPrefix } = launcherConfig;
  const nodeArgs = prepareArgs(launcherConfig);
  const logFilePath = logsPrefix + '/' + GetTheNodeLogFileName();
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

const restartTheNetNode = async (node: TheNetNode) => {
  try {
    await node.restart();
  } catch (error) {
    Logger.info(`Could not restart TheNetNode: ${error}`);
  }
};

/**
 * Configures, starts and manages the TheNetNode responding to node
 * state changes, app events and IPC messages coming from the renderer.
 *
 * @param launcherConfig {LauncherConfig}
 * @param mainWindow
 */
export const setupTheNode = (
  launcherConfig: LauncherConfig,
  mainWindow: BrowserWindow
): TheNetNode => {
  const theNetNode = new TheNetNode(
    Logger,
    {
      // Dependencies on node.js apis are passed as props to ease testing
      spawn,
      exec,
      readFileSync,
      createWriteStream,
      broadcastTlsConfig: (config: ?TlsConfig) => {
        if (!mainWindow.isDestroyed()) theNodeTlsConfigChannel.send(config, mainWindow);
      },
      broadcastStateChange: (state: TheNodeState) => {
        if (!mainWindow.isDestroyed()) theNodeStateChangeChannel.send(state, mainWindow);
      },
    },
    {
      // TheNetNode lifecycle hooks
      onStarting: () => {},
      onRunning: () => {},
      onStopping: () => {},
      onStopped: () => {},
      onUpdating: () => {},
      onUpdated: () => {},
      onCrashed: code => {
        const restartTimeout = theNetNode.startupTries > 0 ? 30000 : 0;
        Logger.info(`TheNetNode crashed with code ${code}. Restarting in ${restartTimeout}ms …`);
        setTimeout(() => restartTheNetNode(theNetNode), restartTimeout);
      },
      onError: () => {},
      onUnrecoverable: () => {},
    }
  );
  startTheNetNode(theNetNode, launcherConfig);

  theNodeStatusChannel.onRequest(() => {
    Logger.info('ipcMain: Received request from renderer for node status.');
    return Promise.resolve(theNetNode.status);
  });

  theNodeStatusChannel.onReceive((status: TheNodeStatus) => {
    theNetNode.saveStatus(status);
    Logger.info(`ipcMain: nodeStatus was received and saved: ${JSON.stringify(theNetNode.status)}`);
    return Promise.resolve(theNetNode.status);
  });

  theNodeStateChangeChannel.onRequest(() => {
    Logger.info('ipcMain: Received request from renderer for node state.');
    return Promise.resolve(theNetNode.state);
  });

  theNodeTlsConfigChannel.onRequest(() => {
    Logger.info('ipcMain: Received request from renderer for tls config.');
    return Promise.resolve(theNetNode.tlsConfig);
  });

  theNodeAwaitUpdateChannel.onReceive(() => {
    Logger.info('ipcMain: Received request from renderer to await update.');
    setTimeout(async () => {
      await theNetNode.expectNodeUpdate();
      Logger.info('TheNetNode applied an update. Exiting App with code 20.');
      // safeExitWithCode(20);
    });
    return Promise.resolve();
  });

  // theNodeRestartChannel.onReceive(() => {
  //   Logger.info('ipcMain: Received request from renderer to restart node.');
  //   return theNetNode.restart(true); // forced restart
  // });

  theNodeRestartChannel.onReceive((options: TheNodeRestartOptions) => {
    Logger.info(
      `ipcMain: Received request from renderer to restart node. with options: ${JSON.stringify(
        options
      )}`
    );
    return theNetNode.restartWithOptions(true, options); // forced restart
  });

  theNodeFaultInjectionChannel.onReceive(fault => {
    Logger.info(`ipcMain: Received request to inject a fault into the node: ${String(fault)}`);
    return theNetNode.setFault(fault);
  });

  return theNetNode;
};
