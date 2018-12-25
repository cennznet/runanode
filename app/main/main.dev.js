/* eslint global-require: off */
// import { setupCennzNet } from './cennznet/setup';
// import { CennzNetNode } from './cennznet/CennzNetNode';
// import { launcherConfig } from './config';

const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const polyfill = require('@babel/polyfill');

// const { setupCennzNet } = require('./cennznet/setup');
// const { CennzNetNode } = require('./cennznet/CennzNetNode');
// const { launcherConfig } = require('./config');

let mainWindow = null;
// let cennzNetNode = null;

const createDefaultWindow = () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
  });

  mainWindow.loadURL(`file://${__dirname}/../renderer/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.on('update-downloaded', info => {
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5000);
});

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }
  mainWindow = createDefaultWindow();
  // cennzNetNode = setupCennzNet(launcherConfig, mainWindow);

  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates();
  }
});

// ipcMain.on('quitAndInstall', () => {
//   autoUpdater.quitAndInstall();
// });
