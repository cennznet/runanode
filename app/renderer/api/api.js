// @flow
import _ from 'lodash';
import { SimpleKeyring, Wallet } from 'cennznet-wallet';
import { Api } from 'cennznet-api';
import uuid from 'uuid/v4';
import BigNumber from 'bignumber.js';
import {u32, Balance} from '@polkadot/types';

import { generateMnemonic } from 'renderer/utils/crypto';
import { stringifyData, stringifyError } from 'common/utils/logging';
import { getSystemHealth } from './nodes/requests/getSystemHealth';
import { Logger } from '../utils/logging';

// Common Types
import type { RequestConfig } from './common/types';

// Nodes Types
import type { SystemHealth, NodeInfo, NodeSoftware, GetNetworkStatusResponse } from './nodes/types';
import type { NodeQueryParams } from './nodes/requests/getSystemHealth';

// Wallets Types
import type {
  CreateMnemonicRequest,
  CreateWalletRequest,
  GeneratePaperRequest,
  GetWalletAddressRequest,
} from './wallets/types';

import CennznetWallet from './wallets/CennznetWallet';

// Common errors
import {
  GenericApiError,
  IncorrectSpendingPasswordError,
  ReportRequestError,
  InvalidMnemonicError,
  ForbiddenMnemonicError,
} from './common/errors';
import { generatePaperWalletChannel } from '../ipc/generatePaperWalletChannel';
import { environment } from '../../main/environment';

const { buildLabel } = environment;

export default class CennzApi {
  config: RequestConfig;
  api: Api;

  constructor(config: RequestConfig) {
    this.setRequestConfig(config);
    Api.create({
      provider: 'ws://localhost:9944',
    }).then((api) => {
      this.api = api;
    });
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
      filters: [
        {
          name: 'paper-wallet-certificate',
          extensions: ['pdf'],
        },
      ],
    });

    if (!filePath) return;

    await generatePaperWalletChannel.send({
      address: request.address,
      filePath,
      mnemonics: request.mnemonic.split(', '),
      isMainnet: true,
      networkName: request.networkName,
      buildLabel,
      messages: {
        walletAddressLabel: request.name,
        recoveryPhraseLabel: 'SEED PHRASE',
        infoTitle: 'Paper Wallet',
        infoAuthor: 'Odin',
      },
    });

    return filePath;
  };

  createWallet = async (request: CreateWalletRequest): Promise<CennznetWallet> => {
    Logger.debug('CennznetApi::createWallet called');
    try {
      const wallet = new Wallet();
      await wallet.createNewVault(request.passphrase);
      const keyring = new SimpleKeyring();
      await keyring.addFromMnemonic(request.mnemonic);
      await wallet.addKeyring(keyring);

      const cennznetWallet = new CennznetWallet({
        id: uuid(),
        name: request.name,
        amount: new BigNumber(0),
        hasPassword: request.passphrase !== null,
        wallet,
      });
      Logger.debug('CennznetApi::createWallet success');
      return cennznetWallet;
    } catch (error) {
      Logger.error('CennznetApi::createWallet error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  getWalletAddress = async (request: GetWalletAddressRequest): Promise<string[]> => {
    Logger.debug('CennznetApi::getWalletAddress called');
    try {
      const walletAddress = Object.keys(request.accountKeyringMap);
      Logger.debug(`CennznetApi::getWalletAddress success: ${walletAddress}`);
      return walletAddress;
    } catch (error) {
      Logger.error('CennznetApi::getWalletAddress error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  getSystemHealth = async (queryParams?: NodeQueryParams): Promise<SystemHealth> => {
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

  genericAssetNextAssetId = async (): Promise<u32> => {
    Logger.debug('CennznetApi::getNextAssetId called');
    try {
      const nextAssetId = await this.api.query.genericAsset.nextAssetId();
      Logger.debug(`CennznetApi::getNextAssetId nextAssetId: ${nextAssetId}`);
      return nextAssetId;
    } catch (error) {
      Logger.error('CennznetApi::getNextAssetId error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * The free balance of a given asset under an account.
   * @param assetId
   * @param walletAddress
   * @returns {Promise<number>}
   */
  genericAssetFreeBalance = async (assetId: number, walletAddress: string): Promise<Balance> => {
    Logger.debug('CennznetApi::genericAssetFreeBalance called');
    try {
      const freeBalance = await this.api.query.genericAsset.freeBalance(assetId, walletAddress);
      Logger.debug(`CennznetApi::genericAssetFreeBalance freeBalance: ${freeBalance}`);
      return freeBalance;
    } catch (error) {
      Logger.error('CennznetApi::genericAssetFreeBalance error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * The reserved balance of a given asset under an account.
   * @param assetId
   * @param walletAddress
   * @returns {Promise<number>}
   */
  genericAssetReservedBalance = async (assetId: number, walletAddress: string): Promise<Balance> => {
    Logger.debug('CennznetApi::genericAssetReservedBalance called');
    try {
      const reservedBalance = await this.api.query.genericAsset.reservedBalanc(assetId, walletAddress);
      Logger.debug(`CennznetApi::genericAssetReservedBalance freeBalance: ${reservedBalance}`);
      return reservedBalance;
    } catch (error) {
      Logger.error('CennznetApi::genericAssetReservedBalance error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * Total supply of a given asset.
   * @param assetId
   * @returns {Promise<number>}
   */
  genericAssetTotalSupply = async (assetId: number): Promise<Balance> => {
    Logger.debug('CennznetApi::genericAssetTotalSupply called');
    try {
      const totalSupply = await this.api.query.genericAsset.totalSupply(assetId);
      Logger.debug(`CennznetApi::genericAssetTotalSupply freeBalance: ${totalSupply}`);
      return totalSupply;
    } catch (error) {
      Logger.error('CennznetApi::genericAssetTotalSupply error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   *
   * @param assetId
   * @param toWalletAddress
   * @param fromWalletAddress
   * @param amount
   * @param wallet
   * @returns {Promise<Hash>}
   */
  genericAssetTransfer = async (assetId: number, toWalletAddress: string, fromWalletAddress: string, amount: BigNumber, wallet): Promise<Object> => {
    Logger.debug('CennznetApi::genericAssetTransfer called');
    try {
      this.api.setSigner(wallet);
      const tx = await this.api.tx.genericAsset.transfer(assetId, fromWalletAddress, amount).send({from: toWalletAddress});
      this.api.setSigner(null);
      Logger.debug(`CennznetApi::genericAssetTransfer tx: ${tx}`);
      return tx;
    } catch (error) {
      Logger.error('CennznetApi::genericAssetTransfer error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

}
