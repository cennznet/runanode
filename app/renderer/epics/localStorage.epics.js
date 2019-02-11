import { EMPTY, from, of } from 'rxjs';
import { mergeMap, map, concat } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { storageKeys, getStorage, setStorage, clearStorage } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';

const getStorageEpic = action$ =>
  action$.pipe(
    ofType(types.getStorage.requested),
    mergeMap(async ({ payload }) => {
      const value = await getStorage(payload.key);
      return { type: types.getStorage.completed, payload: { key: payload.key, value } };
    })
  );

const setStorageEpic = action$ =>
  action$.pipe(
    ofType(types.setStorage.requested),
    mergeMap(async ({ payload }) => {
      await setStorage(payload.key, payload.value);
      return { type: types.setStorage.completed, payload };
    })
  );

const clearStorageEpic = action$ =>
  action$.pipe(
    ofType(types.clearStorage.requested),
    mergeMap(async ({ payload }) => {
      const value = await clearStorage(payload.key);
      return { type: types.clearStorage.completed, payload: { key: payload.key, value } };
    })
  );

const resetLocalStorageEpic = action$ =>
  action$.pipe(
    ofType(types.resetLocalStorage.triggered),
    mergeMap(() => {
      return of(
        {
          type: types.clearStorage.requested,
          payload: { key: storageKeys.TERMS_OF_USE_ACCEPTANCE },
        },
        {
          type: types.clearStorage.requested,
          payload: { key: storageKeys.REMEMBER_NETWORK },
        },
        {
          type: types.clearStorage.requested,
          payload: { key: storageKeys.SELECTED_NETWORK },
        },
        {
          type: types.clearStorage.requested,
          payload: { key: storageKeys.WALLETS },
        },
        {
          type: types.clearStorage.requested,
          payload: { key: storageKeys.GENESIS_CONFIG_FILE_INFO },
        },
        {
          type: types.clearStorage.requested,
          payload: { key: storageKeys.WALLETS },
        },
      );
    })
  );

const syncWalletDataEpic = action$ =>
  action$.pipe(
    ofType(types.syncWalletData.requested),
    mergeMap(async ({ payload }) => {
      Logger.debug(`syncWalletDataEpic`);
      let wallets = await getStorage(storageKeys.WALLETS);
      if (wallets === null) {
        wallets = [];
      }

      const myWallet = wallets.find(x => x.id === payload.id);
      if(myWallet) {
        Logger.debug(`myWallet: ${myWallet}`);
        const myWalletIndex = wallets.findIndex(x => x.id === payload.id);
        Logger.debug(`myWalletIndex: ${myWalletIndex}`);
        const syncedWallet = await window.odin.api.cennz.syncWalletData(myWallet);
        Logger.debug(`wallets[myWalletIndex]: ${myWalletIndex}, ${syncedWallet}`);
        wallets[myWalletIndex] = syncedWallet;
      }
      return {
        type: types.syncWalletData.completed,
        payload: { wallets },
      };
    })
  );

export default [getStorageEpic, setStorageEpic, clearStorageEpic, resetLocalStorageEpic, syncWalletDataEpic];
