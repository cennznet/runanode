import { EMPTY, from, of } from 'rxjs';
import { concat, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Wallet } from 'cennznet-wallet';
import ROUTES from 'renderer/constants/routes';
import types from '../types';
import { getStorage, storageKeys } from '../api/utils/storage';

const createWalletEpic = action$ =>
  action$.pipe(
    ofType(types.walletCreate.requested),
    mergeMap(async ({ payload }) => {
      const { name, mnemonic, passphrase } = payload;
      let wallets = await getStorage(storageKeys.WALLETS);
      if (wallets === null) {
        wallets = [];
      }
      const wallet = await window.odin.api.cennz.createWallet({
        name,
        mnemonic,
        passphrase: passphrase || '',
      });
      wallets.push(wallet);

      return {
        type: types.walletCreate.completed,
        payload: { wallets },
      };
    })
  );

const walletCreateCompletedEpic = action$ =>
  action$.pipe(
    ofType(types.walletCreate.completed),
    mergeMap(({ payload }) => {
      return of({
        type: types.setStorage.requested,
        payload: { key: storageKeys.WALLETS, value: payload.wallets },
      }).pipe(
        concat(
          of({
            type: types.navigation.triggered,
            payload: ROUTES.WALLET.ROOT,
          })
        )
      );
    })
  );

export default [createWalletEpic, walletCreateCompletedEpic];
