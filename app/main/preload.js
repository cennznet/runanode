// @flow
import os from 'os';
import _https from 'https';
import _http from 'http';
import { ipcRenderer as _ipcRenderer, remote as _remote } from 'electron';
import _electronLog from 'electron-log';
import ElectronStore from 'electron-store';
import parseArgs from 'minimist';
import R from 'ramda';
import { environment } from './environment';

const _process = process;
const _electronStore = new ElectronStore();

const processArgv = R.merge(
  { DEBUG_PROD: _process.env.DEBUG_PROD },
  parseArgs(_remote.process.argv)
);

const isDevOrDebugProd = R.propOr(false, 'DEBUG_PROD')(processArgv);

process.once('loaded', () => {
  Object.assign(global, {
    Buffer,
    dialog: {
      showSaveDialog: (...args) => _remote.dialog.showSaveDialog(...args),
    },
    electronLog: {
      debug: (...args) => _electronLog.debug(...args),
      info: (...args) => _electronLog.info(...args),
      error: (...args) => _electronLog.error(...args),
      warn: (...args) => _electronLog.warn(...args),
    },
    electronStore: {
      get: (...args) => _electronStore.get(...args),
      set: (...args) => _electronStore.set(...args),
      delete: (...args) => _electronStore.delete(...args),
    },
    environment,
    isDevOrDebugProd,
    https: {
      request: (...args) => _https.request(...args),
    },
    http: {
      request: (...args) => _http.request(...args),
    },
    ipcRenderer: {
      on: (...args) => _ipcRenderer.on(...args),
      once: (...args) => _ipcRenderer.once(...args),
      send: (...args) => _ipcRenderer.send(...args),
      removeListener: (...args) => _ipcRenderer.removeListener(...args),
      removeAllListeners: (...args) => _ipcRenderer.removeAllListeners(...args),
    },
    os: {
      platform: os.platform(),
    },
  });
  // Expose require for Spectron!
  if (_process.env.NODE_ENV === 'test') {
    // $FlowFixMe
    global.spectronRequire = __non_webpack_require__; // eslint-disable-line
  }
  if (!isDevOrDebugProd) {
    // ESLint will warn about any use of eval(), even this one
    // eslint-disable-next-line
    global.eval = () => {
      throw new Error('This app does not support window.eval().');
    };
  }
});
