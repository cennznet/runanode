// @flow
import { app } from 'electron';

export const acquireAppInstanceLock = () => {
  const isSingleInstance = app.requestSingleInstanceLock();
  if (!isSingleInstance) {
    throw new Error('Another Odin instance is already running.');
  }
};

export const releaseAppInstanceLock = () => (
  app.releaseSingleInstanceLock()
);
