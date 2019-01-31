import { EMPTY, from, of, empty } from 'rxjs';
import { concat, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Wallet } from 'cennznet-wallet';

import types from '../types';
import { getStorage, storageKeys } from '../api/utils/storage';
import { Logger } from '../utils/logging';
import { generatePaperWalletChannel } from '../ipc/generatePaperWalletChannel';
import ROUTES from '../constants/routes';

const testPageEpic = action$ =>
  action$.pipe(
    ofType(types.testPage.triggered),
    mergeMap(() => EMPTY)
  );

const walletCreateEpic = action$ =>
  action$.pipe(
    ofType(types.walletCreate.triggered),
    mergeMap(async () => {
      Logger.info('walletCreateEpic');
      const mnemonic = window.odin.api.cennz.createMnemonic({num: 24});
      const wallet = await window.odin.api.cennz.createWallet({ name: 'test wallet', mnemonic, passphrase: 'password'});
      return {
        type: types.setStorage.requested,
        payload: { key: storageKeys.WALLET, value: wallet },
      };
    })
  );

export default [testPageEpic, walletCreateEpic];
