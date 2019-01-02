// @flow
import CennzApi from './api';
// import LocalStorageApi from './utils/localStorage';

export type Api = {
  ada: CennzApi,
  // localStorage: LocalStorageApi,
};

export const setupApi = (isTest: boolean, network: string): Api => ({
  ada: new CennzApi(isTest, {
    port: 8090,
    ca: Uint8Array.from([]),
    key: Uint8Array.from([]),
    cert: Uint8Array.from([]),
  }),
  // localStorage: new LocalStorageApi(network),
});
