// @flow
import path from 'path';
import { app, dialog } from 'electron';
import readLauncherConfig from './utils/readLauncherConfig';
import { environment } from './environment';

// Make sure Odin is started with required configuration
const { NODE_ENV, LAUNCHER_CONFIG } = process.env;

/**
 * The shape of the config params, usually provided to the cennznet-node launcher
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

export const APP_NAME = 'Odin';
export const launcherConfig: LauncherConfig = readLauncherConfig(LAUNCHER_CONFIG);
export const appLogsFolderPath = launcherConfig.logsPrefix;
export const pubLogsFolderPath = path.join(appLogsFolderPath, 'pub');
export const ALLOWED_LOGS = ['Odin.log'];
export const ALLOWED_NODE_LOGS = new RegExp(/(node.json-)(\d{14}$)/);
export const ALLOWED_LAUNCHER_LOGS = new RegExp(/(launcher-)(\d{14}$)/);
export const MAX_NODE_LOGS_ALLOWED = 3;
export const MAX_LAUNCHER_LOGS_ALLOWED = 3;

// CennetNetNode config
export const NODE_STARTUP_TIMEOUT = 5000;
export const NODE_STARTUP_MAX_RETRIES = 5;
export const NODE_SHUTDOWN_TIMEOUT = environment.isTest ? 5000 : 10000;
export const NODE_KILL_TIMEOUT = environment.isTest ? 5000 : 10000;
export const NODE_UPDATE_TIMEOUT = environment.isTest ? 10000 : 60000;
