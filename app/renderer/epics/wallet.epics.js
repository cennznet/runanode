import { EMPTY, from, of, empty } from 'rxjs';
import { concat, mergeMap, mapTo, filter, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Wallet } from 'cennznet-wallet';
import BN from 'bn.js';
import R from 'ramda';

import types from '../types';
import { getStorage, storageKeys } from '../api/utils/storage';
import { Logger } from '../utils/logging';

const syncWalletDataEpic = action$ =>
  action$.pipe(
    ofType(types.syncWalletData.requested),
    mergeMap(async ({ payload }) => {
      Logger.debug(`syncWalletDataEpic`);
      console.log('myWallet - syncWalletDataEpic', payload);
      let wallets = await getStorage(storageKeys.WALLETS);
      if (wallets === null) {
        wallets = [];
      }

      const myWallet = wallets.find(x => x.id === payload.id);
      console.log('myWallet', myWallet);
      if (myWallet) {
        Logger.debug(`myWallet: ${myWallet}`);
        console.log('myWallet', myWallet);
        const myWalletIndex = wallets.findIndex(x => x.id === payload.id);
        Logger.debug(`myWalletIndex: ${myWalletIndex}`);
        const syncedWallet = await window.odin.api.cennz.syncWalletData(myWallet);
        Logger.debug(`wallets[myWalletIndex]: ${myWalletIndex}, ${syncedWallet}`);
        console.log(`wallets[myWalletIndex]: ${myWalletIndex}, ${syncedWallet}`);
        wallets[myWalletIndex] = syncedWallet;
      }
      return {
        type: types.setStorage.requested,
        payload: { key: storageKeys.WALLETS, value: wallets },
      };
    })
  );

const transferEpic = action$ =>
  action$.pipe(
    ofType(types.transfer.requested),
    mergeMap(async ({ payload }) => {
      Logger.debug(`transferEpic`);
      const assetId = new BN(payload.assetId, 10);
      const { toAddress, fromAddress, wallet } = payload;
      const amount = new BN(payload.amount, 10);
      const txHash = await window.odin.api.cennz.doGenericAssetTransfer(
        assetId,
        fromAddress,
        toAddress,
        amount,
        wallet
      );
      Logger.info(`txHash: ${txHash}`);
      if (txHash) {
        return {
          type: types.transfer.completed,
          payload: { txHash },
        };
      }
      return { type: types.transfer.failed };
    })
  );

const addAccountEpic = action$ =>
  action$.pipe(
    ofType(types.addAccount.requested),
    mergeMap(async ({ payload }) => {
      const { toUpdateWallet, newAccountName } = payload;
      const { wallet } = toUpdateWallet;
      const { updatedWallet, newAccount } = await window.odin.api.cennz.addAccount({ wallet });
      const resolvedWalletItem = R.set(R.lensProp('wallet'), updatedWallet, toUpdateWallet);
      const syncedWallet = await window.odin.api.cennz.syncWalletData(resolvedWalletItem);
      syncedWallet.accounts[newAccount] = { name: newAccountName };

      const storedWallets = await getStorage(storageKeys.WALLETS);
      const toUpdateWalletIndex = R.findIndex(R.propEq('id', syncedWallet.id))(storedWallets);
      const wallets = R.update(toUpdateWalletIndex, syncedWallet, storedWallets);

      return { type: types.addAccount.completed, payload: wallets };
    }),
    catchError(err => {
      return of({
        type: types.addAccount.failed,
        payload: err,
      });
    })
  );

export default [syncWalletDataEpic, transferEpic, addAccountEpic];
