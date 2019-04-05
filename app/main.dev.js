/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, globalShortcut, Menu, dialog, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { includes } from 'lodash';
import os from 'os';

import mainErrorHandler from 'main/utils/mainErrorHandler';
import { setupLogging } from 'main/utils/setupLogging';
import MenuBuilder from 'main/menu';
import { Logger } from 'main/utils/logging';
import { setupCennzNet } from 'main/cennznet/setup';
import { CennzNetNode } from 'main/cennznet/CennzNetNode';
import { launcherConfig } from 'main/launcherConfig';
import { acquireAppInstanceLock } from 'main/utils/app-instance-lock';
import { safeExitWithCode } from 'main/utils/safeExitWithCode';
import { createMainWindow } from 'main/windows/mainWindow';
import { cennznetStatusChannel } from 'main/ipc/cennznet.ipc';
import { CennzNetNodeStates } from 'common/types/cennznet-node.types';
import { environment } from 'common/environment';

const { isDevOrDebugProd, buildLabel } = environment;

export default class AppUpdater {
  constructor() {
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow;
let cennzNetNode: CennzNetNode;

export const createDefaultWindow = () => {
  Logger.info('createDefaultWindow');

  // Construct new BrowserWindow
  const window = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
  });

  // if(window.process && process.versions && process.versions.electron) {
  //   Logger.info('setting window.electronRequire');
  //   window.electronRequire = require;
  //   delete window.require;
  // }

  window.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  window.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      window.minimize();
    } else {
      window.show();
      window.focus();
    }
  });

  window.on('closed', () => {
    // window = null;
    app.quit();
  });
  return window;
};

const safeExit = async () => {
  if (cennzNetNode.state === CennzNetNodeStates.STOPPING) {
    return;
  }

  if (cennzNetNode.status && cennzNetNode.status.isNodeInStaking) {
    await cennznetStatusChannel.send(cennzNetNode.status, mainWindow);
    return;
  }

  try {
    cennzNetNode.saveStatus(
      Object.assign(cennzNetNode.status || {}, {
        isNodeSafeExisting: true,
      })
    );
    await cennznetStatusChannel.send(cennzNetNode.status, mainWindow);
    Logger.info(`Node:safeExit: cennzNetNode.status ${cennzNetNode.status}`);
    Logger.info(`Node:safeExit: stopping cennznet-node with PID ${cennzNetNode.pid || 'null'}`);

    await cennzNetNode.stop();
    Logger.info('Node:safeExit: exiting Node with code 0.');
    safeExitWithCode(0);
  } catch (stopError) {
    Logger.info(`Node:safeExit: cennznet-node did not exit correctly: ${stopError}`);
    safeExitWithCode(0);
  }
};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDevOrDebugProd) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.error);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  setupLogging();
  mainErrorHandler();

  Logger.info(`========== Odin is starting at ${new Date().toString()} ==========`);

  Logger.info(`!!! ${buildLabel} is running on ${os.platform()} version ${os.release()}
            with CPU: ${JSON.stringify(os.cpus(), null, 2)} with
            ${JSON.stringify(os.totalmem(), null, 2)} total RAM !!!`);

  // Make sure this is the only App instance running per cluster before doing anything else
  try {
    await acquireAppInstanceLock();
  } catch (e) {
    const dialogTitle = 'Odin is unable to start!';
    const dialogMessage = 'Another Odin instance is already running.';
    dialog.showErrorBox(dialogTitle, dialogMessage);
    app.exit(1);
  }

  if (isDevOrDebugProd) {
    await installExtensions();
  }
  // Detect safe mode
  const isInSafeMode = includes(process.argv.slice(1), '--safe-mode');
  mainWindow = createMainWindow(isInSafeMode);
  // mainWindow = createDefaultWindow();

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  cennzNetNode = setupCennzNet(launcherConfig, mainWindow);

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  mainWindow.on('close', async event => {
    Logger.info('mainWindow received <close> event. Safe exiting Odin now.');
    event.preventDefault();
    await safeExit();
  });

  // Security feature: Prevent creation of new browser windows
  // https://github.com/electron/electron/blob/master/docs/tutorial/security.md#14-disable-or-limit-creation-of-new-windows
  app.on('web-contents-created', (_, contents) => {
    contents.on('new-window', (event, url) => {
      // Prevent creation of new BrowserWindows via links / window.open
      event.preventDefault();
      Logger.info(`Prevented creation of new browser window with url ${url}`);
      // Open these links with the default browser
      shell.openExternal(url);
    });
  });

  // Wait for controlled cennznet-node shutdown before quitting the app
  app.on('before-quit', async event => {
    Logger.info('app received <before-quit> event. Safe exiting Odin now.');
    event.preventDefault(); // prevent Odin from quitting immediately
    await safeExit();
  });
});
