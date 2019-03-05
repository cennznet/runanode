// @flow
import _ from 'lodash';
import { SimpleKeyring, Wallet, HDKeyring } from 'cennznet-wallet';
import { GenericAsset } from 'cennznet-generic-asset';
import { Api } from 'cennznet-api';
import uuid from 'uuid/v4';
import BN from 'bn.js';
import { u32, Balance, AccountId, ValidatorPrefs } from '@polkadot/types';
import { Keyring } from '@polkadot/keyring';
import decode from '@polkadot/keyring/pair/decode';
import { stringToU8a, u8aToString, u8aToHex, hexToU8a } from '@polkadot/util/index';
import assert from 'assert';

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
      const walletAddresses = window.odin.api.cennz.getWalletAccountAddresses(resultWallet);

      // extract data from wallet to accounts
      const accounts = resultWallet.accounts || {};
      for (const walletAddress of walletAddresses) {
        const assets = {};
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
          name: accounts[walletAddress] && accounts[walletAddress].name,
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
   * @param wallet
   * @param fromWalletAddress
   * @param passphrase
   * @returns {Promise<Hash>}
   */
  doStake = async (wallet: CennznetWallet, stashAccountAddress: string, passphrase: string): Promise<Hash> => {
    Logger.debug('CennznetApi::doStake called');
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(passphrase);
      Logger.debug('unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('setSigner');

      const txHash = await this.api.tx.staking.stake().signAndSend(stashAccountAddress);
      Logger.debug(`CennznetApi::doStake txHash ${txHash}`);
      return txHash;
    } catch (error) {
      Logger.error('CennznetApi::doStake error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @param accountAddress
   * @returns {Promise<number>}
   */
  getIntentionIndex = async (accountAddress: string): Promise<number> => {
    Logger.debug('CennznetApi::getIntentionIndex called');
    try {
      const intentions = await this.api.query.staking.intentions();
      Logger.debug(`intentions: ${intentions}`);
      const intentionsStr = intentions.map((item) => {
        return item.toString();
      });
      const intentionsIndex = intentionsStr.indexOf(accountAddress);
      return intentionsIndex;
    } catch (error) {
      Logger.error('CennznetApi::getIntentionIndex error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  saveStakingPreferences = async (wallet: CennznetWallet, prefs: any, accountAddress: string): Promise<any> => {
    Logger.debug('CennznetApi::saveStakingPreferences called');
    Logger.debug(`wallet: ${JSON.stringify(wallet)}`);
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(''); // TODO switch to pin code
      Logger.debug('unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('setSigner');

      const validatorPrefs = new ValidatorPrefs(prefs);
      const intentionIndex = await this.getIntentionIndex(accountAddress);
      const txHash = await this.api.tx.staking.registerPreferences(intentionIndex, validatorPrefs).signAndSend(accountAddress);
      Logger.debug(`CennznetApi::saveStakingPreferences txHash ${txHash}`);
      return txHash;
    } catch (error) {
      Logger.error('CennznetApi::saveStakingPreferences error: ' + stringifyError(error));
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
      Logger.debug('unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('setSigner');

      const intentionsIndex = await this.getIntentionIndex(stashAccountAddress);
      Logger.debug(`stashAccountAddress: ${stashAccountAddress}`);
      Logger.debug(`intentionsIndex: ${intentionsIndex}`);

      const txHash = await this.api.tx.staking
        .unstake(intentionsIndex)
        .signAndSend(stashAccountAddress);
      Logger.debug(`CennznetApi::doUnStake txHash ${txHash}`);
      return txHash;
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
      Logger.debug(`CennznetApi::getValidators success: ${validators}`);
      return validators;
    } catch (error) {
      Logger.error('CennznetApi::getValidators error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * All the accounts with a desire to stake.
   * @returns {Promise<AccountIdList>}
   */
  getIntentions = async (callbackFn: Function): Promise<AccountIdList> => {
    Logger.debug('CennznetApi::getIntentions called');
    try {
      const intentions = await this.api.query.staking.intentions(callbackFn);
      Logger.debug(`CennznetApi::getIntentions success: ${intentions}`);
      return intentions;
    } catch (error) {
      Logger.error('CennznetApi::getIntentions error: ' + stringifyError(error));
      throw new GenericApiError();
    }
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
    Logger.debug('CennznetApi::getSessions called');
    try {
      const sessionLength = await this.api.query.session.sessionLength(callbackFn);
      Logger.debug(`CennznetApi::getSessions success: ${sessionLength}`);
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
    Logger.debug('CennznetApi::getSessionProgress called');
    try {
      const sessionProgress = await this.api.derive.session.sessionProgress(callbackFn);
      Logger.debug(`CennznetApi::getSessionProgress success: ${sessionProgress}`);
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
    Logger.debug('CennznetApi::getSessionLength called');
    try {
      const sessionLength = await this.api.query.session.sessionLength(callbackFn);
      Logger.debug(`CennznetApi::getSessionLength success: ${sessionLength}`);
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
    Logger.debug('CennznetApi::getEraProgress called');
    try {
      const eraProgress = await this.api.derive.session.eraProgress(callbackFn);
      Logger.debug(`CennznetApi::getEraProgress success: ${eraProgress}`);
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
    Logger.debug('CennznetApi::getEraLength called');
    try {
      const eraLength = await this.api.derive.session.eraLength(callbackFn);
      Logger.debug(`CennznetApi::getEraLength success: ${eraLength}`);
      return eraLength;
    } catch (error) {
      Logger.error('CennznetApi::getEraLength error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };
}
