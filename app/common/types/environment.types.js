// @flow
export type Environment = {
  network: string,
  apiVersion: string,
  mobxDevTools: boolean | string,
  current: string,
  reportUrl: string,
  port: string,
  isHot: boolean,
  isDebugProd: boolean,
  isRemoteDebug: boolean,
  isDev: boolean,
  isTest: boolean,
  isProduction: boolean,
  isMainnet: boolean,
  isStaging: boolean,
  isTestnet: boolean,
  isWatchMode: boolean,
  build: string,
  buildNumber: string,
  buildLabel: string,
  platform: string,
  os: string,
  installerVersion: string,
  version: string,
  isWindows: boolean,
  isMacOS: boolean,
  isLinux: boolean,
};
// constants
export const PRODUCTION = 'production';
export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const MAINNET = 'mainnet';
export const STAGING = 'staging';
export const TESTNET = 'testnet';
export const STAGING_REPORT_URL = 'http://localhost:9944/';
export const MAC_OS = 'darwin';
export const WINDOWS = 'win32';
export const LINUX = 'linux';
export const OS_NAMES = {
  [MAC_OS]: 'macOS',
  [WINDOWS]: 'Windows',
  [LINUX]: 'Linux',
};
