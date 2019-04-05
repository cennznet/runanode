// @flow
import CennzApi from './api';
// import LocalStorageApi from './utils/localStorage';

export type Api = {
  cennz: CennzApi,
  // localStorage: LocalStorageApi,
};

export const setupApi = ({dispatch}): Api => ({
  cennz: new CennzApi({
    port: 9933,
    // ca: Uint8Array.from([]),
    // key: Uint8Array.from([]),
    // cert: Uint8Array.from([]),
  }, dispatch),
});
