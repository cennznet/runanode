// @flow
import { app } from 'electron';
import log from 'electron-log';

import { environment } from 'common/environment';

const { isDevOrDebugProd } = environment;

const prefixProcessType = (str: string) => '[main] ' + str;

const logToLevel = level => (message: string) => log[level](prefixProcessType(message));

export const Logger = {
  debug: logToLevel('debug'),
  info: logToLevel('info'),
  error: logToLevel('error'),
  warn: logToLevel('warn'),
};

export const GetLogDir = () => {
  return !app.isPackaged
    ? process.cwd() + '/dist/logs'
    : log.transports.file.findLogPath().replace('log.log', '');
};

export const GetTheNodeLogFileName = () => {
  return 'cennznet-node.log';
};

// export const GetTheNodeLogFullPath = () => {
//   return GetLogDir() + '/cennznet-node.log';
// };
