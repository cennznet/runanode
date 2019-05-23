// @flow
import type {
  TheNodeStorageKeys,
  NetworkNames,
  PlatformNames,
  ProcessNames,
} from '../../common/types/theNode.types';
import { TheNodeProcessNameOptions, NetworkNameOptions } from '../../common/types/theNode.types';

export type Process = {
  pid: number,
  name: string,
  cmd: string,
  ppid?: number,
  cpu: number,
  memore: number,
};

const checkCondition = async (
  condition: () => boolean,
  resolve: Function,
  reject: Function,
  timeout: number,
  retryEvery: number,
  timeWaited: number = 0
): Promise<void> => {
  const result = await condition();
  if (result) {
    resolve();
  } else if (timeWaited >= timeout) {
    reject(`Promised condition not met within ${timeout}ms.`);
  } else {
    setTimeout(
      () =>
        checkCondition(condition, resolve, reject, timeout, retryEvery, timeWaited + retryEvery),
      retryEvery
    );
  }
};

export const promisedCondition = (
  cond: Function,
  timeout: number = 5000,
  retryEvery: number = 1000
): Promise<void> =>
  new Promise((resolve, reject) => {
    checkCondition(cond, resolve, reject, timeout, retryEvery);
  });

const getNetworkName = (network: NetworkNames): string =>
  NetworkNameOptions[network] || NetworkNameOptions.DEV;

export const deriveStorageKeys = (network: NetworkNames): TheNodeStorageKeys => ({
  PREVIOUS_THENODE_PID: `${getNetworkName(network)}-PREVIOUS-THENODE-PID`,
});

export const deriveProcessNames = (platform: PlatformNames): ProcessNames => ({
  THENODE_PROCESS_NAME: TheNodeProcessNameOptions[platform] || 'cennznet-node',
});
