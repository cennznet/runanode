// @flow
import BN from 'bn.js';

export const PreDefinedAssetId = {
  stakingToken: '16000',
  spendingToken: '16001',
  reserveTokenStart: '1000000',
};

export const CustomTokenAssetId = ['16002', '16003', '16004', '16005'];

// https://centralitydev.atlassian.net/wiki/spaces/CNET/pages/675348824/Generic+Asset+Module
export const PreDefinedAssetIdName = {
  '0': 'CENNZ',
  '1': 'CENTRAPAY',
  '2': 'PLUG',
  '3': 'SYLO',
  '4': 'CERTI',
  '5': 'ARDA',
  '16000': 'CENNZ-T',
  '16001': 'CPAY-T',
  '16002': 'PLUG-T',
  '16003': 'SYLO-T',
  '16004': 'CERTI-T',
  '16005': 'ARDA-T',
};

/**
 * NOTE:
 * NetworkName is the key string of chain. Use in Network option select component
 */
export const NetworkNameMapping = {
  THENODE_RIMU: 'rimu',
  THENODE_KAURI: 'kauri',
  Development: 'development',
};

/**
 * NOTE:
 * Convert chain name .
 */
export const chainNameMapping = chainName => {
  const lowerCaseChainName = (chainName && chainName.toLowerCase()) || '';
  const networkNameKeys = Object.keys(NetworkNameMapping);
  const sortedKey = networkNameKeys.find(networkNameKey =>
    lowerCaseChainName.includes(NetworkNameMapping[networkNameKey])
  );

  return NetworkNameMapping[sortedKey];
};

export const theScanTxUrl = {
  rimu: 'https://cennzscan.centrality.me/tx',
  kauri: 'https://cennzscan.centrality.cloud/tx', // TODO  not support DEV yet
};

export const theScanAddressUrl = {
  rimu: 'https://cennzscan.centrality.me/addresses',
  kauri: 'https://cennzscan.centrality.cloud/addresses', // TODO  not support DEV yet
};

export const PreDefinedAssetIdObj = {
  STAKING_TOKEN: {
    ID: PreDefinedAssetId.stakingToken,
    NAME: PreDefinedAssetIdName[PreDefinedAssetId.stakingToken],
    BN: new BN(PreDefinedAssetId.stakingToken, 10),
  },
  SPENDING_TOKEN: {
    ID: PreDefinedAssetId.spendingToken,
    NAME: PreDefinedAssetIdName[PreDefinedAssetId.spendingToken],
    BN: new BN(PreDefinedAssetId.spendingToken, 10),
  },
};

export type TlsConfig = {
  port: number,
  ca: Uint8Array,
  cert: Uint8Array,
  key: Uint8Array,
};

export type NetworkNames = 'dev' | 'kauri' | 'rimu' | string;

export type PlatformNames = 'win32' | 'linux' | 'darwin' | string;

export const NetworkNameOptions = {
  DEV: 'dev',
  THENODE_KAURI: 'kauri',
  THENODE_RIMU: 'rimu',
};

export type TheNodeState =
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

export const TheNodeStates: {
  STARTING: TheNodeState,
  RUNNING: TheNodeState,
  EXITING: TheNodeState,
  STOPPING: TheNodeState,
  STOPPED: TheNodeState,
  UPDATING: TheNodeState,
  UPDATED: TheNodeState,
  CRASHED: TheNodeState,
  ERRORED: TheNodeState,
  UNRECOVERABLE: TheNodeState,
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

export type TheNodePidOptions =
  | 'mainnet-PREVIOUS-THENODE-PID'
  | 'staging-PREVIOUS-THENODE-PID'
  | 'testnet-PREVIOUS-THENODE-PID'
  | 'development-PREVIOUS-THENODE-PID'
  | string;

export type TheNodeStorageKeys = {
  PREVIOUS_THENODE_PID: TheNodePidOptions,
};

export type TheNodeProcessNames = 'cennznet-node' | 'cennznet-node.exe';

export type ProcessNames = {
  THENODE_PROCESS_NAME: TheNodeProcessNames,
};

export const TheNodeProcessNameOptions: {
  win32: TheNodeProcessNames,
  linux: TheNodeProcessNames,
  darwin: TheNodeProcessNames,
} = {
  win32: 'cennznet-node.exe',
  linux: 'cennznet-node',
  darwin: 'cennznet-node',
};

/**
 * Expected fault injection types that can be used to tell
 * theNode to behave faulty (useful for testing)
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

export type TheNodeStatus = {
  isNodeSafeExisting: boolean,
  isNodeInStaking: boolean,
};

export type TheNodeRestartOptions = {
  name: string,
  chain: string,
  isValidatorMode: boolean,
  key: string,
};
