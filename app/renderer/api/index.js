// @flow
import TheApi from './api';
// import LocalStorageApi from './utils/localStorage';

export type Api = {
  appApi: TheApi,
  // localStorage: LocalStorageApi,
};

export const setupApi = ({ dispatch }): Api => ({
  appApi: new TheApi(
    {
      port: 9933,
      // ca: Uint8Array.from([]),
      // key: Uint8Array.from([]),
      // cert: Uint8Array.from([]),
    },
    dispatch
  ),
});
