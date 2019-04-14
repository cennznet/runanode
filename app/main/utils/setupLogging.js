// @flow
import fs from 'fs';
import path from 'path';
import log from 'electron-log';
import moment from 'moment';
import ensureDirectoryExists from './ensureDirectoryExists';
import { pubLogsFolderPath, appLogsFolderPath, APP_NAME } from '../launcherConfig';
import { isFileNameWithTimestamp } from '../../common/utils/files';

const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';

export const setupLogging = () => {

  // will need to re-test how to move main and render logs to different file location
  // const logFilePath = path.join(pubLogsFolderPath, APP_NAME + '.log');
  // ensureDirectoryExists(pubLogsFolderPath);
  // log.transports.file.file = logFilePath;

  log.transports.console.level = isTest ? 'error' : 'info';
  log.transports.rendererConsole.level = isDev ? 'info' : 'info';
  log.transports.file.level = 'info';
  log.transports.file.maxSize = 20 * 1024 * 1024;
  log.transports.file.format = msg => {
    const formattedDate = moment.utc(msg.date).format('YYYY-MM-DDTHH:mm:ss.0SSS');
    // Debug level logging is recorded as "info" as we need it in app log files
    // but in the same time we do not want to output it to console or terminal window
    const level = msg.level === 'debug' ? 'info' : msg.level;
    return `[${formattedDate}Z] [${level}] ${msg.data}`;
  };

  // Removes existing compressed logs
  fs.readdir(appLogsFolderPath, (err, files) => {
    files.filter(isFileNameWithTimestamp()).forEach(logFileName => {
      const logFile = path.join(appLogsFolderPath, logFileName);
      try {
        fs.unlinkSync(logFile);
      } catch (error) {
        console.error(`Compressed log file "${logFile}" deletion failed: ${error}`);
      }
    });
  });
};
