// @flow
import { app } from 'electron';
import log from 'electron-log';
import { releaseAppInstanceLock } from './app-instance-lock';

export const safeExitWithCode = (exitCode: number) => {
  const { file } = log.transports;
  // Prevent electron-log from writing to stream
  file.level = false;

  releaseAppInstanceLock();
  app.exit(exitCode);
};
