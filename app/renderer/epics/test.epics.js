import { EMPTY, from, of } from 'rxjs';
import { concat, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Wallet } from "cennznet-wallet";

import types from '../types';
import { storageKeys } from '../api/utils/storage';

const testPageEpic = action$ =>
  action$.pipe(
    ofType(types.testPage.triggered),
    mergeMap(() => EMPTY)
  );

const createWalletEpic = action$ =>
  action$.pipe(
    ofType(types.walletCreate.triggered),
    mergeMap(async () => {
      console.log('createWalletEpic');
      const mnemonic = window.odin.api.cennz.createMnemonic({num: 24});
      const wallet = await window.odin.api.cennz.createWallet({ name: 'test wallet', mnemonic, passphrase: 'password'});
      return {
        type: types.setStorage.requested,
        payload: { key: storageKeys.WALLET, value: wallet },
      };
    })
  );

export default [testPageEpic, createWalletEpic];
