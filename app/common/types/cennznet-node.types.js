// @flow
import BN from 'bn.js';

export const PreDefinedAssetId = {
  stakingToken: '0',
  spendingToken: '10',
  reserveTokenStart: '1000000',
};

export const CustomTokenAssetId = ['100'];

export const PreDefinedAssetIdName = {
  '0': 'Stake Token',
  '10': 'Spending Token',
  '100': 'Sylo Token',
};

// Network option to network name mapping, check cennznet-node chain_spec.rs cennznet_dev_config_latest and cennznet_uat_config_latest
export const NetworkNameMapping = {
  'Rimu CENNZnet': 'rimu',
  'Kauri CENNZnet': 'kauri',
};

export const CENNZScanTxUrl = {
  'rimu': 'https://service.centrality.me/cennzscan/tx',
  'kauri': 'https://service.centrality.me/cennzscan/tx', // TODO CENNZScan not support DEV yet
};

export const CENNZScanAddressUrl = {
  'rimu': 'https://service.centrality.me/cennzscan/addresses',
  'kauri': 'https://service.centrality.me/cennzscan/addresses', // TODO CENNZScan not support DEV yet
};

export const PreDefinedAssetIdObj = {
  STAKING_TOKEN: { ID: PreDefinedAssetId.stakingToken, NAME: PreDefinedAssetIdName[PreDefinedAssetId.stakingToken], BN: new BN(PreDefinedAssetId.stakingToken, 10)},
  SPENDING_TOKEN: { ID: PreDefinedAssetId.spendingToken, NAME: PreDefinedAssetIdName[PreDefinedAssetId.spendingToken], BN: new BN(PreDefinedAssetId.spendingToken, 10)},
};

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
  | 'dev'
  | 'kauri' | 'kauri-latest'
  | 'rimu' | 'rimu-latest'
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
  CENNZNET_KAURI: 'kauri',
  CENNZNET_KAURI_LATEST: 'kauri-latest',
  CENNZNET_RIMU: 'rimu',
  CENNZNET_RIMU_LATEST: 'rimu-latest',
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
