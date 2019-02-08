// @flow
import _ from 'lodash';
import { SimpleKeyring, Wallet } from 'cennznet-wallet';
import { Api } from 'cennznet-api';
import uuid from 'uuid/v4';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import {u32, Balance, AccountId} from '@polkadot/types';

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
import {
  PreDefinedAssetIdObj,
  PreDefinedAssetIdName, CustomTokenAssetId,
} from '../../common/types/cennznet-node.types';
import CennznetWalletAccount from './wallets/CennznetWalletAccount';
import CennznetWalletAsset from './wallets/CennznetWalletAsset';

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

  syncWalletData = async (wallet: CennznetWallet): Promise<CennznetWallet> => {
    Logger.debug('CennznetApi::syncWalletData called');
    try {
      const resultWallet = wallet;
      const walletAddresses = window.odin.api.cennz.getWalletAddresses(resultWallet);

      // fetch default data
      console.log(`walletAddresses: ${walletAddresses}`);
      const defaultAccountPublicAddress = walletAddresses[0];
      resultWallet.defaultAccountPublicAddress = defaultAccountPublicAddress;
      console.log(`resultWallet.defaultAccountPublicAddress: ${resultWallet.defaultAccountPublicAddress}`);

      const stakingTokenFreeBalance = await window.odin.api.cennz.genericAssetFreeBalance(PreDefinedAssetIdObj.STAKING_TOKEN.BN, resultWallet.defaultAccountPublicAddress);
      resultWallet.stakingTokenFreeBalance = stakingTokenFreeBalance.toString(10);
      console.log(`resultWallet.stakingTokenFreeBalance: ${resultWallet.stakingTokenFreeBalance}`);
      // const stakingTokenReservedBalance = await window.odin.api.cennz.genericAssetReservedBalance(0, this.defaultAccountPublicAddress);
      // this.stakingTokenReservedBalance = stakingTokenReservedBalance.toString(10);
      // console.log(`this.stakingTokenReservedBalance: ${this.stakingTokenReservedBalance}`);
      // const stakingTokenTotalSupply = await window.odin.api.cennz.genericAssetTotalSupply(0);
      // this.stakingTokenTotalSupply = stakingTokenTotalSupply.toString(10);
      // console.log(`this.stakingTokenTotalSupply: ${this.stakingTokenTotalSupply}`);

      const spendingTokenFreeBalance = await window.odin.api.cennz.genericAssetFreeBalance(PreDefinedAssetIdObj.SPENDING_TOKEN.BN, resultWallet.defaultAccountPublicAddress);
      resultWallet.spendingTokenFreeBalance = spendingTokenFreeBalance.toString(10);
      console.log(`resultWallet.spendingTokenFreeBalance: ${resultWallet.spendingTokenFreeBalance}`);

      const genericAssetNextAssetId = await window.odin.api.cennz.genericAssetNextAssetId();
      resultWallet.genericAssetNextAssetId = genericAssetNextAssetId.toString(10);
      console.log(`resultWallet.genericAssetNextAssetId: ${resultWallet.genericAssetNextAssetId}`);

      // extract data from wallet to accounts
      const accounts = new Map();
      for(const walletAddress of walletAddresses) {
        console.log(`walletAddress: ${walletAddress}`);

        const assets = new Map();
        // eslint-disable-next-line no-await-in-loop
        const stakingTokenAsset = await this.getCennznetWalletAsset(PreDefinedAssetIdObj.STAKING_TOKEN.BN, walletAddress);
        assets[PreDefinedAssetIdObj.STAKING_TOKEN.BN] = stakingTokenAsset;

        // eslint-disable-next-line no-await-in-loop
        const spendingTokenAsset = await this.getCennznetWalletAsset(PreDefinedAssetIdObj.SPENDING_TOKEN.BN, walletAddress);
        assets[PreDefinedAssetIdObj.SPENDING_TOKEN.BN] = spendingTokenAsset;

        // TODO base on nextAssetId fetch all custom token ?
        for(const customToken of CustomTokenAssetId) {
          const customTokenAssetIdAsBN = new BN(customToken, 10);
          // eslint-disable-next-line no-await-in-loop
          const customTokenAsset = await this.getCennznetWalletAsset(customTokenAssetIdAsBN, walletAddress);
          assets[customTokenAssetIdAsBN] = customTokenAsset;
        }

        const account = new CennznetWalletAccount({
          address: walletAddress,
          assets,
        });
        accounts[walletAddress] = account;
      }

      resultWallet.accounts = accounts;
      return resultWallet;
    } catch (error) {
      Logger.error('CennznetApi::syncWalletData error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  getCennznetWalletAsset = async (assetId: BN, walletAddress: String): Promise<CennznetWalletAsset> => {
    Logger.debug('CennznetApi::getCennznetWalletAsset called');
    try {
      const freeBalance = await window.odin.api.cennz.genericAssetFreeBalance(assetId, walletAddress);
      const reservedBalance = new BN('0', 10);
      const totalBalance = freeBalance.add(reservedBalance);
      const asset = new CennznetWalletAsset({
        assetId,
        address: walletAddress,
        name: PreDefinedAssetIdName[assetId],
        freeBalance,
        reservedBalance,
        totalBalance,
      });
      return asset;
    } catch (error) {
      Logger.error('CennznetApi::getCennznetWalletAsset error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  createWalletWithSimpleKeyRing = async (request: CreateWalletRequest): Promise<CennznetWallet> => {
    Logger.debug('CennznetApi::createWalletWithSimpleKeyRing called');
    try {
      const wallet = new Wallet();
      await wallet.createNewVault(request.passphrase);
      const keyring = new SimpleKeyring();
      await keyring.addFromMnemonic(request.mnemonic);
      await wallet.addKeyring(keyring);

      const cennznetWallet = new CennznetWallet({
        id: uuid(),
        name: request.name,
        hasPassword: request.passphrase !== null,
        wallet,
      });
      Logger.debug('CennznetApi::createWalletWithSimpleKeyRing success');
      return cennznetWallet;
    } catch (error) {
      Logger.error('CennznetApi::createWalletWithSimpleKeyRing error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @param request
   * @returns {Promise<*|Array<string>>}
   */
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

  /**
   * @param request
   * @returns {string[]}
   */
  getWalletAddresses = (request: CennznetWallet): string[] => {
    Logger.debug('CennznetApi::getWalletAddresses called');
    try {
      const walletAddresses = Object.keys(request.wallet._accountKeyringMap);
      Logger.debug(`CennznetApi::getWalletAddresses success: ${walletAddresses}`);
      return walletAddresses;
    } catch (error) {
      Logger.error('CennznetApi::getWalletAddresses error: ' + stringifyError(error));
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
  genericAssetFreeBalance = async (assetId: BN, walletAddress: string): Promise<BN> => {
    Logger.debug('CennznetApi::genericAssetFreeBalance called');
    try {
      const freeBalance = await this.api.query.genericAsset.freeBalance(assetId, walletAddress);
      Logger.debug(`CennznetApi::genericAssetFreeBalance freeBalance: ${freeBalance}, ${typeof freeBalance}`);
      return new BN(freeBalance.toString(10), 10);
    } catch (error) {
      Logger.error('CennznetApi::genericAssetFreeBalance error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * The reserved balance of a given asset under an account.
   * @param assetId
   * @param walletAddress
   * @returns {Promise<Balance>}
   */
  genericAssetReservedBalance = async (assetId: BN, walletAddress: string): Promise<Balance> => {
    Logger.debug('CennznetApi::genericAssetReservedBalance called');
    try {
      const reservedBalance = await this.api.query.genericAsset.reservedBalance(assetId, walletAddress);
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
   * @returns {Promise<Balance>}
   */
  genericAssetTotalSupply = async (assetId: BN): Promise<Balance> => {
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
   * @param assetId
   * @param toWalletAddress
   * @param fromWalletAddress
   * @param amount
   * @param wallet
   * @returns {Promise<Object>}
   */
  genericAssetTransfer = async (assetId: BN, toWalletAddress: string, fromWalletAddress: string, amount: BN, wallet): Promise<Object> => {
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
