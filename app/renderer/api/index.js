// @flow
import CennzApi from './api';
// import LocalStorageApi from './utils/localStorage';

export type Api = {
  cennz: CennzApi,
  // localStorage: LocalStorageApi,
};

export const setupApi = (isTest: ?boolean = false): Api => ({
  cennz: new CennzApi(isTest, {
    port: 9933,
    // ca: Uint8Array.from([]),
    // key: Uint8Array.from([]),
    // cert: Uint8Array.from([]),
  }),
});
