// @flow
import _ from 'lodash';
import { SimpleKeyring, Wallet, HDKeyring } from 'cennznet-wallet';
import { GenericAsset } from 'cennznet-generic-asset';
import { Api } from 'cennznet-api';
import uuid from 'uuid/v4';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { u32, Balance, AccountId } from '@polkadot/types';
import * as util from '@polkadot/util';
import { Keyring } from '@polkadot/keyring';

import { generateMnemonic } from 'renderer/utils/crypto';
import { stringifyData, stringifyError } from 'common/utils/logging';
import MNEMONIC_RULE from 'renderer/constants/mnemonic';
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
  PreDefinedAssetIdName,
  CustomTokenAssetId,
} from '../../common/types/cennznet-node.types';
import CennznetWalletAccount from './wallets/CennznetWalletAccount';
import CennznetWalletAsset from './wallets/CennznetWalletAsset';

const { buildLabel } = environment;

// Generate toy keys from name, toy keys is only for play or tests
const toyKeyringFromNames = (names: string[]) => {
  const seeds = names.map(name => util.stringToU8a(name.padEnd(32, ' ')));
  const keyring: any = new Keyring();
  seeds.forEach((seed, index) => {
    const key = keyring.addFromSeed(seed);
    keyring[names[index].toLowerCase()] = key;
  });
  return keyring;
};

const toyKeyring = toyKeyringFromNames([
  'Alice',
  'Bob',
  'Charlie',
  'Dave',
  'Eve',
  'Ferdie',
  'Andrea',
  'Brooke',
  'Courtney',
  'Drew',
  'Emily',
  'Frank',
]);

export default class CennzApi {
  config: RequestConfig;
  api: Api;
  ga: GenericAsset;

  constructor(config: RequestConfig) {
    this.setRequestConfig(config);
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
      mnemonics: request.mnemonic.split(MNEMONIC_RULE),
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

  initCennzetApi = async (): Promise<void> => {
    this.api = await Api.create({
      provider: 'ws://localhost:9944',
    });
    const ga = new GenericAsset(this.api);
    this.ga = ga;
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
      console.log(
        `resultWallet.defaultAccountPublicAddress: ${resultWallet.defaultAccountPublicAddress}`
      );

      const stakingTokenFreeBalance = await window.odin.api.cennz.getGenericAssetFreeBalance(
        PreDefinedAssetIdObj.STAKING_TOKEN.BN,
        resultWallet.defaultAccountPublicAddress
      );
      resultWallet.stakingTokenFreeBalance = stakingTokenFreeBalance.toString(10);
      console.log(`resultWallet.stakingTokenFreeBalance: ${resultWallet.stakingTokenFreeBalance}`);

      const spendingTokenFreeBalance = await window.odin.api.cennz.getGenericAssetFreeBalance(
        PreDefinedAssetIdObj.SPENDING_TOKEN.BN,
        resultWallet.defaultAccountPublicAddress
      );
      resultWallet.spendingTokenFreeBalance = spendingTokenFreeBalance.toString(10);
      console.log(
        `resultWallet.spendingTokenFreeBalance: ${resultWallet.spendingTokenFreeBalance}`
      );

      const genericAssetNextAssetId = await window.odin.api.cennz.getGenericAssetNextAssetId();
      resultWallet.genericAssetNextAssetId = genericAssetNextAssetId.toString(10);
      console.log(`resultWallet.genericAssetNextAssetId: ${resultWallet.genericAssetNextAssetId}`);

      // extract data from wallet to accounts
      const accounts = new Map();
      for (const walletAddress of walletAddresses) {
        console.log(`walletAddress: ${walletAddress}`);

        const assets = new Map();
        // eslint-disable-next-line no-await-in-loop
        const stakingTokenAsset = await this.getCennznetWalletAsset(
          PreDefinedAssetIdObj.STAKING_TOKEN.BN,
          walletAddress
        );
        assets[PreDefinedAssetIdObj.STAKING_TOKEN.BN] = stakingTokenAsset;

        // eslint-disable-next-line no-await-in-loop
        const spendingTokenAsset = await this.getCennznetWalletAsset(
          PreDefinedAssetIdObj.SPENDING_TOKEN.BN,
          walletAddress
        );
        assets[PreDefinedAssetIdObj.SPENDING_TOKEN.BN] = spendingTokenAsset;

        // TODO base on nextAssetId fetch all custom token ?
        for (const customToken of CustomTokenAssetId) {
          const customTokenAssetIdAsBN = new BN(customToken, 10);
          // eslint-disable-next-line no-await-in-loop
          const customTokenAsset = await this.getCennznetWalletAsset(
            customTokenAssetIdAsBN,
            walletAddress
          );
          assets[customTokenAssetIdAsBN] = customTokenAsset;
        }

        // fetch wallet balance
        // eslint-disable-next-line no-await-in-loop
        // const accountFreeBalance = await this.getBalancesFreeBalance(walletAddress);

        const account = new CennznetWalletAccount({
          address: walletAddress,
          // freeBalance: accountFreeBalance,
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

  getCennznetWalletAsset = async (
    assetId: BN,
    walletAddress: String
  ): Promise<CennznetWalletAsset> => {
    Logger.debug('CennznetApi::getCennznetWalletAsset called');
    try {
      const freeBalanceBN = await window.odin.api.cennz.getGenericAssetFreeBalance(
        assetId,
        walletAddress
      );
      const freeBalance = { toBN: freeBalanceBN, toString: freeBalanceBN.toString(10) };
      const reservedBalanceBN = await window.odin.api.cennz.getGenericAssetReservedBalance(
        assetId,
        walletAddress
      );
      const reservedBalance = { toBN: reservedBalanceBN, toString: reservedBalanceBN.toString(10) };
      const totalBalanceBN = freeBalanceBN.add(reservedBalanceBN);
      const totalBalance = { toBN: totalBalanceBN, toString: totalBalanceBN.toString(10) };
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
  };

  createWalletWithSimpleKeyRing = async (request: CreateWalletRequest): Promise<CennznetWallet> => {
    Logger.debug('CennznetApi::createWalletWithSimpleKeyRing called');
    try {
      const wallet = new Wallet();
      await wallet.createNewVault(request.passphrase);
      const keyring = new SimpleKeyring();
      await keyring.addFromMnemonic(request.mnemonic);
      await wallet.addKeyring(keyring);
      const backup = await wallet.export(request.passphrase);

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

  createWalletWithHDKeyRing = async (request: CreateHDKRWalletRequest): Promise<CennznetWallet> => {
    Logger.debug('CennznetApi::createWalletWithHDKeyRing called');
    try {
      const wallet = new Wallet();
      await wallet.createNewVault(request.passphrase);
      await wallet.addAccount();
      const exportedWallet = await wallet.export(request.passphrase);
      const mnemonic = exportedWallet && exportedWallet[0].data.mnemonic;
      console.log('createWalletWithHDKeyRing', wallet);
      console.log('createWalletWithHDKeyRing - backup', exportedWallet);

      const cennznetWallet = new CennznetWallet({
        id: uuid(),
        name: request.name,
        hasPassword: request.passphrase !== null,
        mnemonic,
        wallet,
      });
      Logger.debug('CennznetApi::createWalletWithHDKeyRing success');
      return cennznetWallet;
    } catch (error) {
      Logger.error('CennznetApi::createWalletWithHDKeyRing error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  restoreWallet = async (request: RestoreHDKRWalletRequest): Promise<CennznetWallet> => {
    Logger.debug('CennznetApi::restoreWalletWithHDKeyRing called');
    try {
      const wallet = new Wallet();
      await wallet.createNewVault(request.passphrase);
      const keyring = new HDKeyring({ mnemonic: request.mnemonic });
      wallet.createNewVaultAndRestore(request.passphrase, [keyring]);
      await wallet.addAccount();
      const backup = await wallet.export(request.passphrase);

      const cennznetWallet = new CennznetWallet({
        id: uuid(),
        name: request.name,
        hasPassword: request.passphrase !== null,
        wallet,
      });
      Logger.debug('CennznetApi::createWalletWithHDKeyRing success');
      return cennznetWallet;
    } catch (error) {
      Logger.error('CennznetApi::createWalletWithHDKeyRing error: ' + stringifyError(error));
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

  getGenericAssetNextAssetId = async (): Promise<u32> => {
    Logger.debug('CennznetApi::getNextAssetId called');
    try {
      const nextAssetId = await this.ga.getNextAssetId();
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
  getGenericAssetFreeBalance = async (assetId: BN, walletAddress: string): Promise<BN> => {
    Logger.debug('CennznetApi::getGenericAssetFreeBalance called');
    try {
      const freeBalance = await this.ga.getFreeBalance(assetId, walletAddress);
      console.log(freeBalance);
      Logger.debug(
        `CennznetApi::getGenericAssetFreeBalance freeBalance: ${freeBalance}, ${typeof freeBalance}`
      );
      return new BN(freeBalance.toString(10), 10);
    } catch (error) {
      Logger.error('CennznetApi::getGenericAssetFreeBalance error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * The reserved balance of a given asset under an account.
   * @param assetId
   * @param walletAddress
   * @returns {Promise<Balance>}
   */
  getGenericAssetReservedBalance = async (assetId: BN, walletAddress: string): Promise<Balance> => {
    Logger.debug('CennznetApi::getGenericAssetReservedBalance called');
    try {
      const reservedBalance = await this.ga.getReservedBalance(assetId, walletAddress);
      Logger.debug(`CennznetApi::getGenericAssetReservedBalance freeBalance: ${reservedBalance}`);
      return reservedBalance;
    } catch (error) {
      Logger.error('CennznetApi::getGenericAssetReservedBalance error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * Total supply of a given asset.
   * @param assetId
   * @returns {Promise<Balance>}
   */
  getGenericAssetTotalSupply = async (assetId: BN): Promise<Balance> => {
    Logger.debug('CennznetApi::getGenericAssetTotalSupply called');
    try {
      const totalSupply = await this.ga.getTotalSupply(assetId);
      Logger.debug(`CennznetApi::getGenericAssetTotalSupply freeBalance: ${totalSupply}`);
      return totalSupply;
    } catch (error) {
      Logger.error('CennznetApi::getGenericAssetTotalSupply error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @param assetId
   * @param fromWalletAddress
   * @param toWalletAddress
   * @param amount
   * @param wallet
   * @returns {Promise<Object>}
   */
  doGenericAssetTransfer = async (
    assetId: BN,
    fromWalletAddress: string,
    toWalletAddress: string,
    amount: BN,
    wallet
  ): Promise<Object> => {
    Logger.debug('CennznetApi::doGenericAssetTransfer called');
    try {
      await this.api.setSigner(wallet);
      const tx = await this.ga
        .transfer(assetId, fromWalletAddress, amount)
        .send({ from: toWalletAddress });
      // const tx = await this.api.tx.genericAsset.transfer(assetId, fromWalletAddress, amount).send({from: toWalletAddress});
      // this.api.setSigner(null);
      // const tx = await new Promise(resolve => {
      //   let submittableExtrinsic = this.api.tx.genericAsset.transfer(assetId, toWalletAddress, amount);
      //   debugger;
      //   submittableExtrinsic.signAndSend(toyKeyring.bob, res => {
      //     if (res.status.type === 'Finalised') {
      //       console.log('tx finalized');
      //       resolve();
      //     }
      //   });
      // });
      Logger.debug(`CennznetApi::genericAssetTransfer tx: ${tx}`);
      return tx;
    } catch (error) {
      Logger.error('CennznetApi::genericAssetTransfer error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };
}
