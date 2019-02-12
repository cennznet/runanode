import { EMPTY, from, of, empty } from 'rxjs';
import { concat, mergeMap, mapTo, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Wallet } from 'cennznet-wallet';
import types from '../types';
import { getStorage, storageKeys } from '../api/utils/storage';
import { Logger } from '../utils/logging';

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
      return (
        {
          type: types.setStorage.requested,
          payload: { key: storageKeys.WALLETS, value: wallets },
        }
      );
    })
  );

export default [syncWalletDataEpic];