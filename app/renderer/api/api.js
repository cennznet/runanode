// @flow
import _ from 'lodash';
import { SimpleKeyring, Wallet, HDKeyring } from '@cennznet/wallet';
import { GenericAsset } from '@cennznet/generic-asset';
import { Api } from '@cennznet/api';
import uuid from 'uuid/v4';
import BN from 'bn.js';
import { u32, Balance, AccountId, ValidatorPrefs } from '@polkadot/types';
import { Keyring } from '@polkadot/keyring';
import decode from '@polkadot/keyring/pair/decode';
import { stringToU8a, u8aToString, u8aToHex, hexToU8a } from '@polkadot/util/index';
import assert from 'assert';

import appConfig from 'app/config';
import { storageKeys, clearStorage } from 'renderer/api/utils/storage';
import { WALLET_TYPE } from 'renderer/constants/wallet';
import { generateMnemonic } from 'renderer/utils/crypto';
import { stringifyData, stringifyError } from 'common/utils/logging';
import { environment } from 'common/environment';
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
import {
  PreDefinedAssetIdObj,
  PreDefinedAssetIdName,
  CustomTokenAssetId,
  PreDefinedAssetId,
} from '../../common/types/cennznet-node.types';
import CennznetWalletAccount from './wallets/CennznetWalletAccount';
import CennznetWalletAsset from './wallets/CennznetWalletAsset';

const { buildLabel } = environment;

// Generate toy keys from name, toy keys is only for play or tests
const toyKeyringFromNames = (names: string[]) => {
  const seeds = names.map(name => stringToU8a(name.padEnd(32, ' ')));
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
        infoAuthor: appConfig.app.name,
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

  getBalancesByWallet = async (wallet: CennznetWallet): Promise<CennznetWallet> => {
    try {
      const walletAccountAddresses = window.odin.api.cennz.getWalletAccountAddresses(wallet);

      // @return [{address1: {}}, {address2: {}}, ...]
      const balanceList = await Promise.all(
        walletAccountAddresses.map(async accountAddress => {
          const assets = {};
          const stakingTokenAsset = await this.getCennznetWalletAsset(
            PreDefinedAssetIdObj.STAKING_TOKEN.BN,
            accountAddress
          );
          assets[PreDefinedAssetIdObj.STAKING_TOKEN.BN] = stakingTokenAsset;

          const spendingTokenAsset = await this.getCennznetWalletAsset(
            PreDefinedAssetIdObj.SPENDING_TOKEN.BN,
            accountAddress
          );
          assets[PreDefinedAssetIdObj.SPENDING_TOKEN.BN] = spendingTokenAsset;

          for (const customToken of CustomTokenAssetId) {
            const customTokenAssetIdAsBN = new BN(customToken, 10);
            // eslint-disable-next-line no-await-in-loop
            const customTokenAsset = await this.getCennznetWalletAsset(
              customTokenAssetIdAsBN,
              accountAddress
            );
            assets[customTokenAssetIdAsBN] = customTokenAsset;
          }

          return {
            [accountAddress]: assets,
          };
        })
      );

      // [{address1: {}}, {address2: {}}, ...] ==> {address1: {}, address2: {}}
      return balanceList.reduce((acc, curr) => Object.assign(curr, acc), {});
    } catch (error) {
      Logger.error('CennznetApi::getBalancesByWallet error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  syncWalletData = async (wallet: CennznetWallet): Promise<CennznetWallet> => {
    Logger.debug('CennznetApi::syncWalletData called');
    try {
      const resultWallet = wallet;
      const walletAccountAddresses = window.odin.api.cennz.getWalletAccountAddresses(resultWallet);

      // extract data from wallet to accounts
      const accounts = resultWallet.accounts || {};
      for (const accountAddress of walletAccountAddresses) {
        const assets = {};
        // eslint-disable-next-line no-await-in-loop
        const stakingTokenAsset = await this.getCennznetWalletAsset(
          PreDefinedAssetIdObj.STAKING_TOKEN.BN,
          accountAddress
        );
        assets[PreDefinedAssetIdObj.STAKING_TOKEN.BN] = stakingTokenAsset;

        // eslint-disable-next-line no-await-in-loop
        const spendingTokenAsset = await this.getCennznetWalletAsset(
          PreDefinedAssetIdObj.SPENDING_TOKEN.BN,
          accountAddress
        );
        assets[PreDefinedAssetIdObj.SPENDING_TOKEN.BN] = spendingTokenAsset;

        // TODO base on nextAssetId fetch all custom token ?
        for (const customToken of CustomTokenAssetId) {
          const customTokenAssetIdAsBN = new BN(customToken, 10);
          // eslint-disable-next-line no-await-in-loop
          const customTokenAsset = await this.getCennznetWalletAsset(
            customTokenAssetIdAsBN,
            accountAddress
          );
          assets[customTokenAssetIdAsBN] = customTokenAsset;
        }

        // fetch wallet balance
        // eslint-disable-next-line no-await-in-loop
        // const accountFreeBalance = await this.getBalancesFreeBalance(accountAddress);

        const account = new CennznetWalletAccount({
          address: accountAddress,
          name: accounts[accountAddress] && accounts[accountAddress].name,
          // freeBalance: accountFreeBalance,
          assets,
        });
        accounts[accountAddress] = account;
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

  addAccount = async (request: AddAccountRequest): Promise<CennznetWallet> => {
    Logger.debug('CennznetApi::addAccount called');
    try {
      // reload wallet object
      const originalWallet = new Wallet({
        vault: request.wallet.vault,
        // keyringTypes: [HDKeyring, SimpleKeyring],
      });
      await originalWallet.unlock('');

      const newAccount = await originalWallet.addAccount();
      Logger.debug('CennznetApi::addAccount success');
      return { updatedWallet: originalWallet, newAccount };
    } catch (error) {
      Logger.error('CennznetApi::addAccount error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * TODO remove this
   * @deprecated
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
  getWalletAccountAddresses = (request: CennznetWallet): string[] => {
    Logger.debug('CennznetApi::getWalletAccountAddresses called');
    try {
      const walletAccountAddresses = Object.keys(request.wallet._accountKeyringMap);
      Logger.debug(`CennznetApi::getWalletAccountAddresses success: ${walletAccountAddresses}`);
      return walletAccountAddresses;
    } catch (error) {
      Logger.error('CennznetApi::getWalletAccountAddresses error: ' + stringifyError(error));
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
   * @param wallet
   * @returns {Promise<Wallet>}
   */
  reloadWallet = (wallet: CennznetWallet): Promise<Wallet> => {
    assert(wallet, `missing wallet`);
    const originalWallet = new Wallet({
      vault: wallet.wallet.vault,
      keyringTypes: wallet.type === WALLET_TYPE.HD ? [HDKeyring] : [HDKeyring, SimpleKeyring], // add keyringTypes: [HDKeyring, SimpleKeyring] if SimpleKeyring is used
    });
    return originalWallet;
  };

  /**
   * @param wallet
   * @param address
   * @param passphrase
   * @returns {Promise<*>}
   */
  getSeedFromWalletAccount = async (
    wallet: CennznetWallet,
    address: string,
    passphrase: string
  ): Promise<string> => {
    const originalWallet = this.reloadWallet(wallet);
    await originalWallet.unlock(passphrase);
    assert(wallet.accounts, `missing accounts`);
    assert(address, `missing address`);
    const json = await originalWallet.exportAccount(address, passphrase);
    const decodeMsg = decode(passphrase, hexToU8a(json.encoded));
    const seed = u8aToHex(decodeMsg.seed);
    return seed;
  };


  /**
   * TODO untested
   * @param wallet
   * @param stashAccountAddress
   * @param amount
   * @param passphrase
   * @returns {Promise<Hash>}
   */
  doBond = async (
    wallet: CennznetWallet,
    stashAccountAddress: string,
    amount: number,
    passphrase: string,
  ): Promise<Hash> => {
    Logger.debug('CennznetApi::doBond called');
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(passphrase);
      Logger.debug('CennznetApi::doBond unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('CennznetApi::doBond setSigner');

      const controllerAccount = stashAccountAddress;
      const payee = [stashAccountAddress];
      const accountNonce = await this.api.query.system.accountNonce(controllerAccount);
      const bondTxHash = await this.api.tx.staking.bond(controllerAccount, amount, payee).signAndSend(controllerAccount, { nonce: accountNonce });
      Logger.debug(`CennznetApi::doBond bondTxHash: ${bondTxHash}`);
      return bondTxHash;
    } catch (error) {
      Logger.error('CennznetApi::doBond error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * TODO untested
   * @param wallet
   * @param stashAccountAddress
   * @param amount
   * @param passphrase
   * @returns {Promise<*>}
   */
  doBondExtra = async (
    wallet: CennznetWallet,
    stashAccountAddress: string,
    amount: number,
    passphrase: string,
  ): Promise<Hash> => {
    Logger.debug('CennznetApi::doBondExtra called');
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(passphrase);
      Logger.debug('CennznetApi::doBondExtra unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('CennznetApi::doBondExtra setSigner');

      const controllerAccount = stashAccountAddress;
      const accountNonce = await this.api.query.system.accountNonce(controllerAccount);
      const bondTxHash = await this.api.tx.staking.doBondExtra(amount).signAndSend(controllerAccount, { nonce: accountNonce });
      Logger.debug(`CennznetApi::doBondExtra bondTxHash: ${bondTxHash}`);
      return bondTxHash;
    } catch (error) {
      Logger.error('CennznetApi::doBondExtra error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * TODO untested
   * @param wallet
   * @param stashAccountAddress
   * @param amount
   * @param passphrase
   * @returns {Promise<Hash>}
   */
  doUnBond = async (
    wallet: CennznetWallet,
    stashAccountAddress: string,
    amount: number,
    passphrase: string,
  ): Promise<Hash> => {
    Logger.debug('CennznetApi::doUnBond called');
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(passphrase);
      Logger.debug('CennznetApi::doUnBond unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('CennznetApi::doUnBond setSigner');

      const controllerAccount = stashAccountAddress;
      const accountNonce = await this.api.query.system.accountNonce(controllerAccount);
      const unBondTxHash = await this.api.tx.staking.unbond(amount).signAndSend(controllerAccount, { nonce: accountNonce });
      Logger.debug(`CennznetApi::doUnBond unBondTxHash: ${unBondTxHash}`);
      return unBondTxHash;
    } catch (error) {
      Logger.error('CennznetApi::doUnBond error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @param wallet
   * @param stashAccountAddress
   * @param passphrase
   * @returns {Promise<Function>}
   */
  doStake = async (
    wallet: CennznetWallet,
    stashAccountAddress: string,
    passphrase: string,
    statusCb: Function
  ): Promise<Function> => {
    Logger.debug('CennznetApi::doStake called');
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(passphrase);
      Logger.debug('CennznetApi::doStake unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('CennznetApi::doStake setSigner');

      // bound
      const freeStakingToken = new BN(wallet.accounts[stashAccountAddress].assets[PreDefinedAssetId.stakingToken].freeBalance.toString, 10);
      Logger.debug(`CennznetApi::doStake freeStakingToken: ${freeStakingToken}`);
      const controllerAccount = stashAccountAddress;
      const payee = [stashAccountAddress];
      const accountNonce = await this.api.query.system.accountNonce(controllerAccount);
      Logger.debug(`CennznetApi::doStake accountNonce: ${accountNonce}`);
      const bondTxHash = await this.api.tx.staking.bond(controllerAccount, freeStakingToken, payee).signAndSend(controllerAccount, { nonce: accountNonce });
      Logger.debug(`CennznetApi::doStake bondTxHash: ${bondTxHash}`);

      // query staking bonded account
      const bondedAccount = await this.api.query.staking.bonded(controllerAccount);
      Logger.debug(`CennznetApi::doStake bondedAccount: ${bondedAccount}`);

      // query staking ledger
      const ledger = await this.api.query.staking.ledger(controllerAccount);
      Logger.debug(`CennznetApi::doStake ledger: ${JSON.stringify(ledger)}`);

      // validate
      // TODO preferences should pass in as param
      const preferences = {"unstakeThreshold":3,"validatorPayment":0};
      const newNonce = Number(String(accountNonce)) + 1;
      Logger.debug(`CennznetApi::doStake newNonce: ${newNonce}`);
      const unsubscribeFn = await this.api.tx.staking.validate(preferences).signAndSend(controllerAccount, { nonce: newNonce },
        statusCb);
      Logger.debug(`CennznetApi::doStake unsubscribeFn: ${unsubscribeFn}`);

      return unsubscribeFn;
    } catch (error) {
      Logger.error('CennznetApi::doStake error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @deprecated
   * @param accountAddress
   * @returns {Promise<number>}
   */
  getIntentionIndex = async (accountAddress: string): Promise<number> => {
    Logger.debug('CennznetApi::getIntentionIndex called');
    // try {
    //   const intentions = await this.api.query.staking.intentions();
    //   Logger.debug(`intentions: ${intentions}`);
    //   const intentionsStr = intentions.map(item => {
    //     return item.toString();
    //   });
    //   const intentionsIndex = intentionsStr.indexOf(accountAddress);
    //   return intentionsIndex;
    // } catch (error) {
    //   Logger.error('CennznetApi::getIntentionIndex error: ' + stringifyError(error));
    //   throw new GenericApiError();
    // }
    return -1;
  };

  /**
   * @param wallet
   * @param prefs
   * @param accountAddress
   * @returns {Promise<CodecResult>}
   */
  saveStakingPreferences = async (
    wallet: CennznetWallet,
    prefs: any,
    accountAddress: string
  ): Promise<any> => {
    Logger.debug('CennznetApi::saveStakingPreferences called');
    Logger.debug(`wallet: ${JSON.stringify(wallet)}`);
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(''); // TODO switch to pin code
      Logger.debug('CennznetApi::saveStakingPreferences unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('CennznetApi::saveStakingPreferences setSigner');

      const validatorPrefs = new ValidatorPrefs(prefs);
      const intentionIndex = await this.getIntentionIndex(accountAddress);
      const txHash = await this.api.tx.staking
        .registerPreferences(intentionIndex, validatorPrefs)
        .signAndSend(accountAddress);
      Logger.debug(`CennznetApi::saveStakingPreferences txHash ${txHash}`);
      return txHash;
    } catch (error) {
      Logger.error('CennznetApi::saveStakingPreferences error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @param accountAddress
   * @param callbackFn
   * @returns {Promise<ValidatorPrefs>}
   */
  getValidatorPreferences = async (
    accountAddress: string,
    callbackFn: Function
  ): Promise<ValidatorPrefs> => {
    Logger.debug('CennznetApi::getValidatorPreferences called');
    Logger.debug(`accountAddress: ${accountAddress}`);
    Logger.debug(`callbackFn: ${callbackFn}`);
    try {
      const validatorPreferences = await this.api.query.staking.validatorPreferences(
        accountAddress,
        callbackFn
      );
      Logger.debug(`validatorPreferences: ${JSON.stringify(validatorPreferences)}`);
      return validatorPreferences;
    } catch (error) {
      Logger.error('CennznetApi::getValidatorPreferences error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @param wallet
   * @param stashAccountAddress
   * @param passphrase
   * @returns {Promise<Hash>}
   */
  doUnStake = async (
    wallet: CennznetWallet,
    stashAccountAddress: string,
    passphrase: string
  ): Promise<Hash> => {
    Logger.debug('CennznetApi::doUnStake called');
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(passphrase);
      Logger.debug('CennznetApi::doUnStake unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('CennznetApi::doUnStake setSigner');

      const controllerAccount = stashAccountAddress;

      // query staking ledger
      const ledger = await this.api.query.staking.ledger(controllerAccount);
      Logger.debug(`CennznetApi::doUnStake ledger: ${JSON.stringify(ledger)}`);
      const bondedBalance = new BN(ledger.raw.active.toString(), 10);
      Logger.debug(`CennznetApi::doUnStake bondedBalance: ${bondedBalance}`);

      // TODO not sure why bondedBalance always showing as 100?
      // unbond all amount from staking ledger
      const accountNonce = await this.api.query.system.accountNonce(controllerAccount);
      Logger.debug(`CennznetApi::doUnStake accountNonce: ${accountNonce}`);
      const unBondTxHash = await this.api.tx.staking.unbond(bondedBalance).signAndSend(controllerAccount, { nonce: accountNonce });
      Logger.debug(`CennznetApi::doUnStake unBondTxHash: ${unBondTxHash}`);

      // chill
      const newNonce = Number(String(accountNonce)) + 1;
      const chillTxHash = await this.api.tx.staking.chill().signAndSend(controllerAccount, { nonce: newNonce });
      Logger.debug(`CennznetApi::doUnStake chillTxHash: ${chillTxHash}`);

      // TODO: Chain epic to reflect the changes in reducer immediately
      await clearStorage(storageKeys.STAKING_STASH_ACCOUNT_ADDRESS);

      return chillTxHash;
    } catch (error) {
      Logger.error('CennznetApi::doUnStake error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @param assetId
   * @param fromWalletAddress
   * @param toWalletAddress
   * @param amount
   * @param wallet
   * @returns {Promise<Hash>}
   */
  doGenericAssetTransfer = async (
    assetId: BN,
    fromWalletAddress: string,
    toWalletAddress: string,
    amount: BN,
    wallet: CennznetWallet
  ): Promise<Hash> => {
    Logger.debug('CennznetApi::doGenericAssetTransfer called');
    Logger.debug(
      `assetId: ${assetId.toString(10)}, amount: ${amount.toString(
        10
      )}, fromWalletAddress: ${fromWalletAddress}, toWalletAddress: ${toWalletAddress}`
    );
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(''); // TODO switch to pin code
      Logger.debug('unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('setSigner');

      const txHash = await this.ga
        .transfer(assetId, toWalletAddress, amount)
        .signAndSend(fromWalletAddress);
      Logger.debug(`CennznetApi::doGenericAssetTransfer txHash ${txHash}`);
      return txHash;
    } catch (error) {
      Logger.error('CennznetApi::doGenericAssetTransfer error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * The current set of validators.
   * @returns {Promise<List>}
   */
  getValidators = async (callbackFn: Function): Promise<List> => {
    Logger.debug('CennznetApi::getValidators called');
    try {
      const validators = await this.api.query.session.validators(callbackFn);
      Logger.debug(`CennznetApi::getValidators validators: ${JSON.stringify(validators)}`);
      return validators;
    } catch (error) {
      Logger.error('CennznetApi::getValidators error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @param callbackFn
   * @returns {Promise<any>}
   */
  getSystemEvents = async (callbackFn: Function): Promise<any> => {
    Logger.debug('CennznetApi::getSystemEvents called');
    try {
      const systemEvents = await this.api.query.system.events(callbackFn);
      Logger.debug(`CennznetApi::getSystemEvents success: ${systemEvents}`);
      return systemEvents;
    } catch (error) {
      Logger.error('CennznetApi::getSystemEvents error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @deprecated
   * All the accounts with a desire to stake.
   * @returns {Promise<AccountIdList>}
   */
  getIntentions = async (callbackFn: Function): Promise<AccountIdList> => {
    return [];
    // try {
    //   const intentions = await this.api.query.staking.intentions(callbackFn);
    //   return intentions;
    // } catch (error) {
    //   Logger.error('CennznetApi::getIntentions error: ' + stringifyError(error));
    //   throw new GenericApiError();
    // }
  };

  /**
   * All the accounts with a desire to stake.
   * @returns {Promise<AccountIdList>}
   */
  // getIntentionsBalances = async (callbackFn: Function): Promise<AccountIdList> => {
  //   Logger.debug('CennznetApi::getIntentionsBalances called');
  //   try {
  //     const intentionsBalances = await this.api.derive.staking.intentionsBalances(
  //       ...['balances'],
  //       callbackFn
  //     );
  //     Logger.debug(`CennznetApi::getIntentionsBalances success: ${intentionsBalances}`);
  //     return intentionsBalances;
  //   } catch (error) {
  //     Logger.error('CennznetApi::getIntentionsBalances error: ' + stringifyError(error));
  //     throw new GenericApiError();
  //   }
  // };

  /**
   * Current length of the session.
   * @returns {Promise<BlockNumber>}
   */
  getSessionLength = async (callbackFn: Function): Promise<BlockNumber> => {
    try {
      const sessionLength = await this.api.query.session.sessionLength(callbackFn);
      return sessionLength;
    } catch (error) {
      Logger.error('CennznetApi::getSessions error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * Current progress of the session.
   * @returns {Promise<BlockNumber>}
   */
  getSessionProgress = async (callbackFn: Function): Promise<BlockNumber> => {
    try {
      const sessionProgress = await this.api.derive.session.sessionProgress(callbackFn);
      return sessionProgress;
    } catch (error) {
      Logger.error('CennznetApi::getSessionProgress error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * Current length of the session.
   * @returns {Promise<BlockNumber>}
   */
  getSessionLength = async (callbackFn: Function): Promise<BlockNumber> => {
    try {
      const sessionLength = await this.api.query.session.sessionLength(callbackFn);
      return sessionLength;
    } catch (error) {
      Logger.error('CennznetApi::getSessionLength error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * Era progress.
   * @returns {Promise<BlockNumber>}
   */
  getEraProgress = async (callbackFn: Function): Promise<BlockNumber> => {
    try {
      const eraProgress = await this.api.derive.session.eraProgress(callbackFn);
      return eraProgress;
    } catch (error) {
      Logger.error('CennznetApi::getEraProgress error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * Era length.
   * @returns {Promise<BlockNumber>}
   */
  getEraLength = async (callbackFn: Function): Promise<BlockNumber> => {
    try {
      const eraLength = await this.api.derive.session.eraLength(callbackFn);
      return eraLength;
    } catch (error) {
      Logger.error('CennznetApi::getEraLength error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };
}
