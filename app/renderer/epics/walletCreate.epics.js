import { EMPTY, from, of, empty } from 'rxjs';
import { concat, mergeMap, mapTo, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Wallet } from 'cennznet-wallet';
import ROUTES from 'renderer/constants/routes';
import chainEpics from 'renderer/epics/chainEpics';
import types from '../types';
import { getStorage, storageKeys } from '../api/utils/storage';
import { Logger } from '../utils/logging';
import { generatePaperWalletChannel } from '../ipc/generatePaperWalletChannel';

const createWalletWithSKREpic = action$ =>
  action$.pipe(
    ofType(types.walletCreatWithSKR.requested),
    mergeMap(async ({ payload }) => {
      const { name, mnemonic, passphrase } = payload;
      let wallets = await getStorage(storageKeys.WALLETS);
      if (wallets === null) {
        wallets = [];
      }
      const wallet = await window.odin.api.cennz.createWalletWithSimpleKeyRing({
        name,
        mnemonic,
        passphrase: passphrase || '',
      });

      const accountKeyringMap = wallet && wallet.wallet._accountKeyringMap;
      const walletAddress = await window.odin.api.cennz.getWalletAddress({ accountKeyringMap });
      wallet.wallet.walletAddress = walletAddress;

      // sync wallet data
      const syncedWallet = await window.odin.api.cennz.syncWalletData(wallet);
      wallets.push(syncedWallet);

      return {
        type: types.walletCreatWithSKR.completed,
        payload: { wallets },
      };
    })
  );

const storeWalletEpic = action$ =>
  action$.pipe(
    filter(
      action =>
        action.type === types.walletCreatWithSKR.completed ||
        action.type === types.walletRestoreWithHDKR.completed
    ),
    mergeMap(({ payload: { wallets } }) => {
      return of({
        type: types.setStorage.requested,
        payload: { key: storageKeys.WALLETS, value: wallets },
      });
    })
  );

// To ensure page redirection emitted after wallets storage being completed
const pageRedirectionAfterWalletCreatedEpic = action$ =>
  action$.ofType(types.setStorage.completed).pipe(
    filter(({ payload }) => payload.key === storageKeys.WALLETS),
    mapTo({
      type: types.navigation.triggered,
      payload: ROUTES.WALLET.ROOT,
    })
  );

const walletPaperGenerateEpic = action$ =>
  action$.pipe(
    ofType(types.walletPaperGenerate.requested),
    mergeMap(async ({ payload }) => {
      Logger.debug(`walletPaperGenerateEpic, payload: ${JSON.stringify(payload)}`);
      const savedFilePath = await window.odin.api.cennz.generatePaperWallet({
        mnemonic: payload.mnemonic,
        address: payload.address,
        name: payload.name,
        networkName: payload.networkName,
        isMainnet: payload.isMainnet,
      });
      Logger.debug(`walletPaperGenerateEpic finish, savedPDFPath: ${savedFilePath}`);
      return {
        type: types.walletPaperGenerate.completed,
      };
    })
  );

const restoreHDKRWalletEpic = action$ =>
  action$.pipe(
    ofType(types.walletRestoreWithHDKR.requested),
    mergeMap(async ({ payload }) => {
      const { name, mnemonic, passphrase } = payload;
      let wallets = await getStorage(storageKeys.WALLETS);
      if (wallets === null) {
        wallets = [];
      }
      const wallet = await window.odin.api.cennz.restoreWallet({
        name,
        mnemonic,
        passphrase: passphrase || '',
      });

      const accountKeyringMap = wallet && wallet.wallet._accountKeyringMap;
      const walletAddress = await window.odin.api.cennz.getWalletAddress({ accountKeyringMap });
      wallet.wallet.walletAddress = walletAddress;

      // sync wallet data
      const syncedWallet = await window.odin.api.cennz.syncWalletData(wallet);
      wallets.push(syncedWallet);

      return {
        type: types.walletRestoreWithHDKR.completed,
        payload: { wallets },
      };
    })
  );

export default [
  createWalletWithSKREpic,
  storeWalletEpic,
  pageRedirectionAfterWalletCreatedEpic,
  walletPaperGenerateEpic,
  restoreHDKRWalletEpic,
];
