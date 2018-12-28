// @flow
import log from 'electron-log';

export const isDev = () => process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';


const prefixProcessType = (str: string) => '[main] ' + str;

const logToLevel = (level) => (message: string) => log[level](prefixProcessType(message));

export const Logger = {
  debug: logToLevel('debug'),
  info: logToLevel('info'),
  error: logToLevel('error'),
  warn: logToLevel('warn'),
  findLogPath: log.transports.file.findLogPath,
};

export const GetLogDir = () => {
  return isDev() ? process.cwd() + '/dist/logs' :
  Logger.findLogPath().replace('log.log', '')
}

export const GetCennzNodeLogFileName = () => {
  return 'cennznet-node.log';
}

export const GetCennzNodeLogFullPath = () => {
  return GetLogDir()+'/cennznet-node.log';
}

if(isDev()) {
  log.transports.console.level = 'info';
  log.transports.file.level = 'info';

  Logger.info('In development mode');
  Logger.info('Logging to console at \'info\' level');
  Logger.info('Logging to file at \'info\' level');
  Logger.info(`app log file: ${log.transports.file.findLogPath()}`);
  Logger.info(`cennznet-node log file: ${GetCennzNodeLogFullPath()}`);
} else {
  log.transports.console.level = false;
  log.transports.file.level = 'info';

  Logger.info('In non-development mode');
  Logger.info('Logging to file at \'info\' level');
  Logger.info(`log file: ${log.transports.file.findLogPath()}`);
  Logger.info(`cennznet-node log file: ${GetCennzNodeLogFullPath()}`);
}
