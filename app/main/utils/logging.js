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

export const GetCennzNodeLogFileName = () => {
  return 'cennznet-node.log';
};

export const GetCennzNodeLogFullPath = () => {
  return GetLogDir() + '/cennznet-node.log';
};

if (isDevOrDebugProd) {
  log.transports.console.level = 'info';
  log.transports.file.level = 'info';

  Logger.info('In development mode');
  Logger.info("Logging to console at 'info' level");
  Logger.info("Logging to file at 'info' level");
  Logger.info(`app log file: ${log.transports.file.findLogPath()}`);
  Logger.info(`cennznet-node log file: ${GetCennzNodeLogFullPath()}`);
} else {
  log.transports.console.level = false;
  log.transports.file.level = 'info';

  Logger.info('In non-development mode');
  Logger.info("Logging to file at 'info' level");
  Logger.info(`log file: ${log.transports.file.findLogPath()}`);
  Logger.info(`cennznet-node log file: ${GetCennzNodeLogFullPath()}`);
}
