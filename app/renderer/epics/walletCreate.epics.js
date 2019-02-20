import { EMPTY, from, of, empty } from 'rxjs';
import { concat, mergeMap, mapTo, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Wallet } from 'cennznet-wallet';
import ROUTES from 'renderer/constants/routes';
import { walletType } from 'renderer/constants/wallet';
import chainEpics from 'renderer/epics/chainEpics';
import types from '../types';
import { getStorage, storageKeys } from '../api/utils/storage';
import { Logger } from '../utils/logging';
import { generatePaperWalletChannel } from '../ipc/generatePaperWalletChannel';

const recomposeWallet = async (actionType, payload) => {
  const wallet = payload;

  if (actionType === 'walletCreatWithSKR') {
    wallet.type = walletType.SIMPLEWALLET;
  } else {
    wallet.type = walletType.HDWALLET;
  }

  // sync wallet data
  const syncedWallet = await window.odin.api.cennz.syncWalletData(wallet);

  // store new wallet into storage
  let wallets = await getStorage(storageKeys.WALLETS);
  if (wallets === null) {
    wallets = [];
  }
  wallets.push(syncedWallet);

  return {
    type: types[actionType].completed,
    payload: wallets,
  };
};

const createHDKRWalletEpic = action$ =>
  action$.pipe(
    ofType(types.walletCreatWithHDKR.requested),
    mergeMap(({ payload }) => recomposeWallet('walletCreatWithHDKR', payload))
  );

const createWalletWithSKREpic = action$ =>
  action$.pipe(
    ofType(types.walletCreatWithSKR.requested),
    mergeMap(async ({ payload }) => {
      const { name, mnemonic, passphrase } = payload;
      const wallet = await window.odin.api.cennz.createWalletWithSimpleKeyRing({
        name,
        mnemonic,
        passphrase: passphrase || '',
      });

      return recomposeWallet('walletCreatWithSKR', wallet);
    })
  );

const restoreHDKRWalletEpic = action$ =>
  action$.pipe(
    ofType(types.walletRestoreWithHDKR.requested),
    mergeMap(async ({ payload }) => {
      const { name, mnemonic, passphrase } = payload;
      const wallet = await window.odin.api.cennz.restoreWallet({
        name,
        mnemonic,
        passphrase: passphrase || '',
      });

      return recomposeWallet('walletRestoreWithHDKR', wallet);
    })
  );

const storeWalletEpic = action$ =>
  action$.pipe(
    filter(
      action =>
        action.type === types.walletCreatWithSKR.completed ||
        action.type === types.walletRestoreWithHDKR.completed ||
        action.type === types.walletCreatWithHDKR.completed ||
        action.type === types.addAccount.completed
    ),
    mergeMap(({ payload: wallets }) => {
      return of({
        type: types.setStorage.requested,
        payload: { key: storageKeys.WALLETS, value: wallets, redirect: true },
      });
    })
  );

// To ensure page redirection emitted after wallets storage being completed
const pageRedirectionAfterWalletCreatedEpic = action$ =>
  action$.ofType(types.setStorage.completed).pipe(
    filter(({ payload }) => payload.key === storageKeys.WALLETS && payload.redirect),
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

export default [
  createWalletWithSKREpic,
  storeWalletEpic,
  pageRedirectionAfterWalletCreatedEpic,
  walletPaperGenerateEpic,
  restoreHDKRWalletEpic,
  createHDKRWalletEpic,
];
