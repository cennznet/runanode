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
    ofType(types.walletPaperGenerate.triggered),
    mergeMap(async ({ payload }) => {
      // Logger.debug(`walletPaperGenerateEpic, payload: ${JSON.stringify(payload)}`);
      // console.log(`walletPaperGenerateEpic, payload: ${JSON.stringify(payload)}`);
      // const filePath = global.dialog.showSaveDialog({
      //   defaultPath: 'paper-wallet-certificate.pdf',
      //   filters: [{
      //     name: 'paper-wallet-certificate',
      //     extensions: ['pdf'],
      //   }],
      // });
      //
      // console.log(`walletPaperGenerateEpic, filePath: ${filePath}`);
      // // if cancel button is clicked or path is empty
      // if (!filePath) return EMPTY;
      //
      // const savedFilePath = await window.odin.api.cennz.generatePaperWallet({
      //   mnemonic: payload.mnemonic,
      //   address: payload.address,
      //   name: payload.walletName,
      //   networkName: payload.networkName,
      //   isMainnet: payload.isMainnet,
      // });
      // console.log(`walletPaperGenerateEpic finish, savedPDFPath: ${savedFilePath}`);
      // Logger.debug(`walletPaperGenerateEpic finish, savedPDFPath: ${savedFilePath}`);
      // return {
      //   type: types.empty.triggered,
      // };

      Logger.info('walletPaperGenerateEpic');

      const filePath = global.dialog.showSaveDialog({
        defaultPath: 'paper-wallet-certificate.pdf',
        filters: [{
          name: 'paper-wallet-certificate',
          extensions: ['pdf'],
        }],
      });

      Logger.info(`walletPaperGenerateEpic filePath: ${filePath} `);

      // if cancel button is clicked or path is empty
      if (!filePath) return EMPTY;

      await generatePaperWalletChannel.send({
        address: 'address',
        filePath,
        mnemonics: 'mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics mnemonics'.split(' '),
        isMainnet: true,
        buildLabel: 'buildLabel',
        messages: {
          walletAddressLabel: 'walletAddressLabel',
          recoveryPhraseLabel: 'recoveryPhraseLabel',
          infoTitle: 'infoTitle',
          infoAuthor: 'infoAuthor',
        }
      });
      Logger.info('walletPaperGenerateEpic finish');
      return {
        type: types.empty.triggered,
      };
    })
  );

export default [createWalletEpic, storeWalletEpic, pageRedirectionAfterWalletCreatedEpic, walletPaperGenerateEpic];
