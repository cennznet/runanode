// @flow
export type TlsConfig = {
  port: number,
  ca: Uint8Array,
  cert: Uint8Array,
  key: Uint8Array,
};

export type NetworkNames =
  | 'mainnet'
  | 'staging'
  | 'testnet'
  | 'development'
  | 'cennznet-dev'
  | 'cennznet-uat'
  | 'local-testnet'
  | string;

export type PlatformNames = 'win32' | 'linux' | 'darwin' | string;

export const NetworkNameOptions = {
  mainnet: 'mainnet',
  staging: 'staging',
  testnet: 'testnet',
  development: 'development',
  CENNZNET_DEV: 'cennznet-dev',
  CENNZNET_UAT: 'cennznet-uat',
  LOCAL_TESTNET: 'local-testnet',
};

export type CennzNetNodeState =
  | 'stopped'
  | 'starting'
  | 'running'
  | 'stopping'
  | 'updating'
  | 'updated'
  | 'crashed'
  | 'errored'
  | 'exiting'
  | 'unrecoverable';

export const CennzNetNodeStates: {
  STARTING: CennzNetNodeState,
  RUNNING: CennzNetNodeState,
  EXITING: CennzNetNodeState,
  STOPPING: CennzNetNodeState,
  STOPPED: CennzNetNodeState,
  UPDATING: CennzNetNodeState,
  UPDATED: CennzNetNodeState,
  CRASHED: CennzNetNodeState,
  ERRORED: CennzNetNodeState,
  UNRECOVERABLE: CennzNetNodeState,
} = {
  STARTING: 'starting',
  RUNNING: 'running',
  EXITING: 'exiting',
  STOPPING: 'stopping',
  STOPPED: 'stopped',
  UPDATING: 'updating',
  UPDATED: 'updated',
  CRASHED: 'crashed',
  ERRORED: 'errored',
  UNRECOVERABLE: 'unrecoverable',
};

export type CennzNetPidOptions =
  | 'mainnet-PREVIOUS-CENNZNET-PID'
  | 'staging-PREVIOUS-CENNZNET-PID'
  | 'testnet-PREVIOUS-CENNZNET-PID'
  | 'development-PREVIOUS-CENNZNET-PID'
  | string;

export type CennzNetNodeStorageKeys = {
  PREVIOUS_CENNZNET_PID: CennzNetPidOptions,
};

export type CennzNetNodeProcessNames = 'cennznet-node' | 'cennznet-node.exe';

export type ProcessNames = {
  CENNZNET_PROCESS_NAME: CennzNetNodeProcessNames,
};

export const CennzNetProcessNameOptions: {
  win32: CennzNetNodeProcessNames,
  linux: CennzNetNodeProcessNames,
  darwin: CennzNetNodeProcessNames,
} = {
  win32: 'cennznet-node.exe',
  linux: 'cennznet-node',
  darwin: 'cennznet-node',
};

/**
 * Expected fault injection types that can be used to tell
 * cennznet-node to behave faulty (useful for testing)
 */
export type FaultInjection =
  | 'FInjIgnoreShutdown'
  | 'FInjIgnoreAPI'
  | 'FInjApplyUpdateNoExit'
  | 'FInjApplyUpdateWrongExitCode';

export const FaultInjections: {
  IgnoreShutdown: FaultInjection,
  IgnoreApi: FaultInjection,
  ApplyUpdateNoExit: FaultInjection,
  ApplyUpdateWrongExitCode: FaultInjection,
} = {
  IgnoreShutdown: 'FInjIgnoreShutdown',
  IgnoreApi: 'FInjIgnoreAPI',
  ApplyUpdateNoExit: 'FInjApplyUpdateNoExit',
  ApplyUpdateWrongExitCode: 'FInjApplyUpdateWrongExitCode',
};

export type FaultInjectionIpcResponse = Array<FaultInjection>;
export type FaultInjectionIpcRequest = [FaultInjection, boolean];

export type CennzNetStatus = {
  isNodeSafeExisting: boolean,
  isNodeResponding: boolean,
  isNodeSubscribed: boolean,
  isNodeSyncing: boolean,
  isNodeInSync: boolean,
  hasBeenConnected: boolean,
};

export type CennzNetRestartOptions = {
  name: string,
  chain: string,
};
