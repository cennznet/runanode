// @flow
import _ from 'lodash';
import { SimpleKeyring, Wallet } from 'cennznet-wallet';
import uuid from 'uuid/v4';
import BigNumber from 'bignumber.js';

import {generateMnemonic } from 'renderer/utils/crypto';
import { stringifyData, stringifyError } from 'common/utils/logging';
import { getSystemHealth } from './nodes/requests/getSystemHealth';
import { Logger } from '../utils/logging';

// Common Types
import type {
  RequestConfig,
} from './common/types';

// Nodes Types
import type {
  SystemHealth,
  NodeInfo,
  NodeSoftware,
  GetNetworkStatusResponse
} from './nodes/types';
import type { NodeQueryParams } from './nodes/requests/getSystemHealth';

// Wallets Types
import type {
  CreateMnemonicRequest, CreateWalletRequest, GeneratePaperRequest,
} from './wallets/types';

import CennznetWallet from './wallets/CennznetWallet';

// Common errors
import {
  GenericApiError,
  IncorrectSpendingPasswordError,
  ReportRequestError,
  InvalidMnemonicError,
  ForbiddenMnemonicError
} from './common/errors';
import { generatePaperWalletChannel } from '../ipc/generatePaperWalletChannel';

export default class CennzApi {

  config: RequestConfig;

  constructor(isTest: boolean, config: RequestConfig) {
    this.setRequestConfig(config);
    // if (isTest) patchAdaApi(this);
  }

  setRequestConfig(config: RequestConfig) {
    this.config = config;
  }

  createMnemonic = (request: CreateMnemonicRequest): Promise<String> => {
    const mnemonic = generateMnemonic(request.num).split(' ');
    return _.map(mnemonic).join(', ');
  };

  generatePaperWallet = async (request: GeneratePaperRequest): Promise<String> => {
    Logger.debug('CennznetApi::generatePaperWallet called');
    const filePath = global.dialog.showSaveDialog({
      defaultPath: 'paper-wallet-certificate.pdf',
      filters: [{
        name: 'paper-wallet-certificate',
        extensions: ['pdf'],
      }],
    });

    // if cancel button is clicked or path is empty
    if (!filePath) return;

    await generatePaperWalletChannel.send({
      address: 'address',
      filePath,
        mnemonics: request.mnemonic.split(' '),
      isMainnet: true,
      buildLabel: 'buildLabel',
      messages: {
        walletAddressLabel: 'walletAddressLabel',
        recoveryPhraseLabel: 'recoveryPhraseLabel',
        infoTitle: 'infoTitle',
        infoAuthor: 'infoAuthor',
      }
    });

    return filePath;
  }

  createWallet = async (request: CreateWalletRequest): Promise<CennznetWallet> => {
    Logger.debug('CennznetApi::createWallet called');
    try {
      const wallet = new Wallet();
      await wallet.createNewVault(request.passphrase);
      const keyring = new SimpleKeyring();
      await keyring.addFromMnemonic(request.mnemonic)
      await wallet.addKeyring(keyring);

      const cennznetWallet = new CennznetWallet({
        id: uuid(),
        name: request.name,
        amount: new BigNumber(0),
        hasPassword: request.passphrase !== null,
        wallet
      });
      Logger.debug('CennznetApi::createWallet success');
      return cennznetWallet;
    } catch (error) {
      Logger.error('CennznetApi::createWallet error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  getSystemHealth = async (
    queryParams?: NodeQueryParams
  ): Promise<SystemHealth> => {
    const loggerText = `CennznetApi::getSystemHealth`;
    Logger.debug(`${loggerText} called`);
    try {
      const status: SystemHealth = await getSystemHealth(this.config, queryParams);
      Logger.debug(`${loggerText} success: ${stringifyData(status)}`);
      return status;
    } catch (error) {
      Logger.error(`${loggerText} error: ${stringifyError(error)}`);
      throw new GenericApiError(error);
    }
  };


}
