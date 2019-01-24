// @flow
import log from 'electron-log';

const prefixProcessType = (str: string) => '[renderer] ' + str;

const logToLevel = (level) => (message: string) => log[level](prefixProcessType(message));

export const Logger = {
  debug: logToLevel('info'), // TODO renderer debug log not show in console and file log, it should at least show in file logs
  info: logToLevel('info'),
  error: logToLevel('error'),
  warn: logToLevel('warn'),
};
