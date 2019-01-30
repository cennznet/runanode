import { EMPTY, from, of, combineLatest } from 'rxjs';
import { mergeMap, catchError, concat } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Wallet } from 'cennznet-wallet';
import ROUTES from 'renderer/constants/routes';
import chainEpics from 'renderer/epics/chainEpics';
import types from '../types';
import { getStorage, storageKeys } from '../api/utils/storage';

// const createWalletEpic = action$ =>
//   action$.pipe(
//     ofType(types.walletCreate.requested),
//     mergeMap(async ({ payload }) => {
//       const { name, mnemonic, passphrase } = payload;
//       const wallet = await window.odin.api.cennz.createWallet({
//         name,
//         mnemonic,
//         passphrase: passphrase || '',
//       });
//       return {
//         type: types.walletCreate.completed,
//         payload: { wallet },
//       };
//     })
//   );

// const getAddressAfterWalletCreation = chainEpics(
//   types.walletCreate.completed,
//   types.getWalletAddress.requested,
//   payload => payload && payload.wallet._accountKeyringMap
// );

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
      const accountKeyringMap = wallet && wallet.wallet._accountKeyringMap;
      const walletAddress = await window.odin.api.cennz.getWalletAddress({ accountKeyringMap });
      wallet.wallet.walletAddress = walletAddress;

      wallets.push(wallet);

      return {
        type: types.walletCreate.completed,
        payload: { wallets },
      };
    })
  );

const storeWalletEpic = action$ =>
  action$.pipe(
    ofType(types.walletCreate.completed),
    mergeMap(({ payload: { wallets } }) => {
      return of({
        type: types.setStorage.requested,
        payload: { key: storageKeys.WALLETS, value: wallets },
      }).pipe(concat(of({ type: types.navigation.triggered, payload: ROUTES.WALLET.ROOT })));
    })
  );

export default [createWalletEpic, storeWalletEpic];
