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

const walletPaperGenerateTestEpic = action$ =>
  action$.pipe(
    ofType(types.walletPaperGenerateTest.requested),
    mergeMap(async () => {
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

export default [testPageEpic, walletCreateEpic, walletPaperGenerateTestEpic];
