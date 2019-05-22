// @flow
import path from 'path';
import readLauncherConfig from './utils/readLauncherConfig';

const { LAUNCHER_CONFIG } = process.env;

/**
 * The shape of the config params, usually provided to the node launcher
 */
export type LauncherConfig = {
  statePath: string,
  nodePath: string,
  nodeArgs: Array<string>,
  tlsPath: string,
  reportServer?: string,
  nodeDbPath: string,
  logsPrefix: string,
  nodeLogConfig: string,
  nodeTimeoutSec: number,
  configuration: {
    filePath: string,
    key: string,
    systemStart: string,
    seed: string,
  },
};

export const APP_NAME = 'App';
export const launcherConfig: LauncherConfig = readLauncherConfig(LAUNCHER_CONFIG);
export const appLogsFolderPath = launcherConfig.logsPrefix;
export const pubLogsFolderPath = path.join(appLogsFolderPath, 'pub');
