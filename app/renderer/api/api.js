// @flow
import _ from 'lodash';
import { SimpleKeyring, Wallet, HDKeyring } from '@cennznet/wallet';
import { GenericAsset } from '@cennznet/crml-generic-asset';
import { Api } from '@cennznet/api';
import uuid from 'uuid/v4';
import BN from 'bn.js';
import { u32, Balance, AccountId, ValidatorPrefs } from '@polkadot/types';
import { naclKeypairFromSeed as naclFromSeed } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import decode from '@polkadot/keyring/pair/decode';
import addressDecode from '@polkadot/keyring/address/decode';
import { stringToU8a, u8aToString, u8aToHex, hexToU8a } from '@polkadot/util/index';
import assert from 'assert';
import WsProvider from '@polkadot/rpc-provider/ws';

import appConfig from 'app/config';
import { storageKeys, clearStorage } from 'renderer/api/utils/storage';
import { WALLET_TYPE } from 'renderer/constants/wallet';
import { generateMnemonic } from 'renderer/utils/crypto';
import { stringifyData, stringifyError } from 'common/utils/logging';
import { environment } from 'common/environment';
import MNEMONIC_RULE from 'renderer/constants/mnemonic';
// import * as Types from '@cennznet/types';
import * as CustomTypes from './runtime';
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
import actionTypes from '../types';

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
  NetworkNameOptions,
} from '../../common/types/cennznet-node.types';
import CennznetWalletAccount from './wallets/CennznetWalletAccount';
import CennznetWalletAsset from './wallets/CennznetWalletAsset';

const { buildLabel } = environment;

export default class CennzApi {
  config: RequestConfig;
  api: Api;
  apiRemote: Api;
  ga: GenericAsset;
  dispatch;

  constructor(config: RequestConfig, dispatch) {
    this.setRequestConfig(config);
    this.dispatch = dispatch;
  }

  setRequestConfig(config: RequestConfig) {
    this.config = config;
  }

  createMnemonic = (request: CreateMnemonicRequest): Promise<String> => {
    const mnemonic = generateMnemonic(request.num).split(' ');
    return _.map(mnemonic).join(', ');
  };

  generatePaperWallet = async (request: GeneratePaperRequest): Promise<String> => {
    Logger.debug('api::generatePaperWallet called');
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

  initGa = async (): Promise<void> => {
    Logger.debug(`initGa start`);
    const ga = await GenericAsset.create(this.api);
    this.ga = ga;
    Logger.debug(`initGa done`);
  };

  initApi = async (): Promise<void> => {
    Logger.debug(`initApi start`);
    const types = { ...CustomTypes };
    Logger.debug(`initApi streamUrl: ${appConfig.webSocket.localStreamUrl}`);
    const wsProvider = new WsProvider(appConfig.webSocket.localStreamUrl);
    this.api = new Api({
      provider: wsProvider,
      types,
    });
    this.api.on('connected', () => {
      Logger.debug(`initApi connected`);
      this.dispatch({
        type: actionTypes.wsLocalStatusChange.triggered,
        payload: {
          type: 'connected',
        },
      });
    });
    this.api.on('ready', async () => {
      Logger.debug(`initApi ready`);
      this.dispatch({
        type: actionTypes.wsLocalStatusChange.triggered,
        payload: {
          type: 'ready',
        },
      });
    });
    this.api.on('disconnected', () => {
      Logger.debug(`initApi disconnected`);
      this.dispatch({
        type: actionTypes.wsLocalStatusChange.triggered,
        payload: {
          type: 'disconnected',
        },
      });
    });
    this.api.on('error', err => {
      Logger.debug(`initApi error`);
      Logger.debug(JSON.stringify(err));
      this.dispatch({
        type: actionTypes.wsLocalStatusChange.triggered,
        payload: {
          type: 'error',
          err,
        },
      });
    });
    Logger.debug(`initApi done`);
  };

  initRemoteApi = async (): Promise<void> => {
    Logger.debug(`initRemoteApi start`);
    // eslint-disable-next-line
    const selectedNetwork = electronStore.get(storageKeys.SELECTED_NETWORK);
    const remoteStreamUrl = selectedNetwork
      ? appConfig.webSocket.remoteStreamUrlMap[selectedNetwork.value]
      : appConfig.webSocket.remoteStreamUrl;
    await this.initRemoteApiWithUrl(remoteStreamUrl);
    Logger.debug(`initRemoteApi done`);
  };

  initRemoteApiWithUrl = async (remoteStreamUrl): Promise<void> => {
    Logger.debug(`initRemoteApiWithUrl start`);
    const types = { ...CustomTypes };
    // eslint-disable-next-line
    Logger.debug(`initRemoteApiWithUrl remoteStreamUrl: ${remoteStreamUrl}`);
    const wsProvider = new WsProvider(remoteStreamUrl);
    this.apiRemote = new Api({
      provider: wsProvider,
      types,
    });
    this.apiRemote.on('connected', () => {
      Logger.debug(`initRemoteApiWithUrl apiRemote connected`);
      this.dispatch({
        type: actionTypes.wsRemoteStatusChange.triggered,
        payload: {
          type: 'connected',
        },
      });
    });
    this.apiRemote.on('ready', () => {
      Logger.debug(`initRemoteApiWithUrl ready`);
      this.dispatch({
        type: actionTypes.wsRemoteStatusChange.triggered,
        payload: {
          type: 'ready',
        },
      });
    });
    this.apiRemote.on('disconnected', () => {
      Logger.debug(`initRemoteApiWithUrl disconnected`);
      this.dispatch({
        type: actionTypes.wsRemoteStatusChange.triggered,
        payload: {
          type: 'disconnected',
        },
      });
    });
    this.apiRemote.on('error', err => {
      Logger.debug(`initRemoteApiWithUrl error`);
      Logger.debug(JSON.stringify(err));
      this.dispatch({
        type: actionTypes.wsRemoteStatusChange.triggered,
        payload: {
          type: 'error',
          err,
        },
      });
    });
    Logger.debug(`initRemoteApiWithUrl done`);
  };

  switchNetwork = async (network: string): Promise<void> => {
    let _network = network;
    if (network.endsWith('json')) {
      _network = NetworkNameOptions.development;
    }
    Logger.debug(`switchNetwork, network: ${_network}`);
    Logger.debug(`disconnect apiRemote`);
    this.apiRemote.disconnect();

    const remoteStreamUrl = appConfig.webSocket.remoteStreamUrlMap[_network];
    this.initRemoteApiWithUrl(remoteStreamUrl);
    Logger.debug(`connect to new apiRemote: ${appConfig.webSocket.remoteStreamUrlMap[_network]}`);
  };

  getBalancesByWallet = async (wallet: CennznetWallet): Promise<CennznetWallet> => {
    try {
      const walletAccountAddresses = this.getWalletAccountAddresses(wallet);

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
      Logger.error('api::getBalancesByWallet error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  syncWalletData = async (wallet: CennznetWallet): Promise<CennznetWallet> => {
    Logger.debug('api::syncWalletData called');
    try {
      const resultWallet = wallet;
      const walletAccountAddresses = this.getWalletAccountAddresses(resultWallet);

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
      Logger.error('api::syncWalletData error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  getCennznetWalletAsset = async (
    assetId: BN,
    walletAddress: String
  ): Promise<CennznetWalletAsset> => {
    // Logger.trace('api::getCennznetWalletAsset called');
    try {
      const freeBalanceBN = await this.getGenericAssetFreeBalance(assetId, walletAddress);
      const freeBalance = { toBN: freeBalanceBN, toString: freeBalanceBN.toString(10) };
      const reservedBalanceBN = await this.getGenericAssetReservedBalance(assetId, walletAddress);
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
      Logger.error('api::getCennznetWalletAsset error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  createWalletWithSimpleKeyRing = async (request: CreateWalletRequest): Promise<CennznetWallet> => {
    Logger.debug('api::createWalletWithSimpleKeyRing called');
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
      Logger.debug('api::createWalletWithSimpleKeyRing success');
      return cennznetWallet;
    } catch (error) {
      Logger.error('api::createWalletWithSimpleKeyRing error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  createWalletWithHDKeyRing = async (request: CreateHDKRWalletRequest): Promise<CennznetWallet> => {
    Logger.debug('api::createWalletWithHDKeyRing called');
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
      Logger.debug('api::createWalletWithHDKeyRing success');
      return cennznetWallet;
    } catch (error) {
      Logger.error('api::createWalletWithHDKeyRing error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  restoreWallet = async (request: RestoreHDKRWalletRequest): Promise<CennznetWallet> => {
    Logger.debug('api::restoreWalletWithHDKeyRing called');
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
      Logger.debug('api::createWalletWithHDKeyRing success');
      return cennznetWallet;
    } catch (error) {
      Logger.error('api::createWalletWithHDKeyRing error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  addAccount = async (request: AddAccountRequest): Promise<CennznetWallet> => {
    Logger.debug('api::addAccount called');
    try {
      // reload wallet object
      const originalWallet = new Wallet({
        vault: request.wallet.vault,
        // keyringTypes: [HDKeyring, SimpleKeyring],
      });
      await originalWallet.unlock('');

      const newAccount = await originalWallet.addAccount();
      Logger.debug('api::addAccount success');
      return { updatedWallet: originalWallet, newAccount };
    } catch (error) {
      Logger.error('api::addAccount error: ' + stringifyError(error));
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
    Logger.debug('api::getWalletAddress called');
    try {
      const walletAddress = Object.keys(request.accountKeyringMap);
      Logger.debug(`api::getWalletAddress success: ${walletAddress}`);
      return walletAddress;
    } catch (error) {
      Logger.error('api::getWalletAddress error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @param request
   * @returns {string[]}
   */
  getWalletAccountAddresses = (request: CennznetWallet): string[] => {
    // Logger.trace('api::getWalletAccountAddresses called');
    try {
      const walletAccountAddresses = Object.keys(request.wallet._accountKeyringMap);
      // Logger.trace(`api::getWalletAccountAddresses success: ${walletAccountAddresses}`);
      return walletAccountAddresses;
    } catch (error) {
      Logger.error('api::getWalletAccountAddresses error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  getSystemHealth = async (queryParams?: NodeQueryParams): Promise<SystemHealth> => {
    const loggerText = `api::getSystemHealth`;
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
    Logger.debug('api::getNextAssetId called');
    try {
      const nextAssetId = await this.ga.getNextAssetId();
      Logger.debug(`api::getNextAssetId nextAssetId: ${nextAssetId}`);
      return nextAssetId;
    } catch (error) {
      Logger.error('api::getNextAssetId error: ' + stringifyError(error));
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
    // Logger.trace('api::getGenericAssetFreeBalance called');
    try {
      const freeBalance = await this.ga.getFreeBalance(assetId, walletAddress);
      // Logger.trace(
      //   `api::getGenericAssetFreeBalance freeBalance: ${freeBalance}, ${typeof freeBalance}`
      // );
      return new BN(freeBalance.toString(10), 10);
    } catch (error) {
      Logger.error('api::getGenericAssetFreeBalance error: ' + stringifyError(error));
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
    // Logger.trace('api::getGenericAssetReservedBalance called');
    try {
      const reservedBalance = await this.ga.getReservedBalance(assetId, walletAddress);
      // Logger.trace(`api::getGenericAssetReservedBalance freeBalance: ${reservedBalance}`);
      return reservedBalance;
    } catch (error) {
      Logger.error('api::getGenericAssetReservedBalance error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * Total supply of a given asset.
   * @param assetId
   * @returns {Promise<Balance>}
   */
  getGenericAssetTotalSupply = async (assetId: BN): Promise<Balance> => {
    Logger.debug('api::getGenericAssetTotalSupply called');
    try {
      const totalSupply = await this.ga.getTotalSupply(assetId);
      Logger.debug(`api::getGenericAssetTotalSupply freeBalance: ${totalSupply}`);
      return totalSupply;
    } catch (error) {
      Logger.error('api::getGenericAssetTotalSupply error: ' + stringifyError(error));
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
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(passphrase);
      assert(wallet.accounts, `missing accounts`);
      assert(address, `missing address`);
      const json = await originalWallet.exportAccount(address, passphrase);
      const decodeMsg = decode(passphrase, hexToU8a(json.encoded));
      let publicKey =null;
      let  secretKey =null;
      if (decodeMsg.secretKey.length === 64) {
        publicKey = decodeMsg.publicKey;
        secretKey = decodeMsg.secretKey;
        Logger.debug(`api::getSeedFromWalletAccount decoded length: ${decodeMsg.secretKey.length}`);
      } else {
        // default is sr
        const pair = naclFromSeed(decodeMsg.secretKey);

        publicKey = pair.publicKey;
        secretKey = pair.secretKey;
        Logger.debug(`api::getSeedFromWalletAccount ed : ${pair}`);
      }

      // const { publicKey, secretKey } = decodeMsg;
      const SEC_LENGTH = 64;
      const SEED_LENGTH = 32;
      const ZERO_STR = '0x00';
      const seedU8a = secretKey.subarray(0, SEC_LENGTH - SEED_LENGTH);
      const seed = u8aToHex(seedU8a);
      assert(publicKey && publicKey.length === 32, 'Expected valid publicKey, 32-bytes');
      assert(secretKey && secretKey.length === 64, 'Expected valid secretKey, 64-bytes');
      assert(seed && seed.length > ZERO_STR.length, 'Expected valid seed, 32-bytes');
      Logger.debug(`api::getSeedFromWalletAccount seed: ${seed.length}`);
      return seed;
    } catch (error) {
      Logger.error('api::getSeedFromWalletAccount error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  getAddressFromSeed = async (seed, keyType = 'ed25519') => {
    try {
      const keyring = new SimpleKeyring();
      Logger.debug(`api::getAddressFromSeed seed: ${seed}`);

      const seedHex = hexToU8a(seed);
      const account = await keyring.addFromSeed(seedHex, {}, keyType);
      const address = account.address()
      Logger.debug(`api::getAddressFromSeed: ${address}`);

      return address;
    } catch (error) {
      Logger.error('api::getAddressFromSeed error: ' + stringifyError(error));
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
  doBond = async (
    wallet: CennznetWallet,
    stashAccountAddress: string,
    amount: number,
    passphrase: string
  ): Promise<Hash> => {
    Logger.debug('api::doBond called');
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(passphrase);
      Logger.debug('api::doBond unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('api::doBond setSigner');

      const controllerAccount = stashAccountAddress;
      const payee = [stashAccountAddress];
      const accountNonce = await this.api.query.system.accountNonce(controllerAccount);
      const bondTxHash = await this.api.tx.staking
        .bond(controllerAccount, amount, payee)
        .signAndSend(controllerAccount, { nonce: accountNonce });
      Logger.debug(`api::doBond bondTxHash: ${bondTxHash}`);
      return bondTxHash;
    } catch (error) {
      Logger.error('api::doBond error: ' + stringifyError(error));
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
    passphrase: string
  ): Promise<Hash> => {
    Logger.debug('api::doBondExtra called');
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(passphrase);
      Logger.debug('api::doBondExtra unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('api::doBondExtra setSigner');

      const controllerAccount = stashAccountAddress;
      const accountNonce = await this.api.query.system.accountNonce(controllerAccount);
      const bondTxHash = await this.api.tx.staking
        .doBondExtra(amount)
        .signAndSend(controllerAccount, { nonce: accountNonce });
      Logger.debug(`api::doBondExtra bondTxHash: ${bondTxHash}`);
      return bondTxHash;
    } catch (error) {
      Logger.error('api::doBondExtra error: ' + stringifyError(error));
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
    passphrase: string
  ): Promise<Hash> => {
    Logger.debug('api::doUnBond called');
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(passphrase);
      Logger.debug('api::doUnBond unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('api::doUnBond setSigner');

      const controllerAccount = stashAccountAddress;
      const accountNonce = await this.api.query.system.accountNonce(controllerAccount);
      const unBondTxHash = await this.api.tx.staking
        .unbond(amount)
        .signAndSend(controllerAccount, { nonce: accountNonce });
      Logger.debug(`api::doUnBond unBondTxHash: ${unBondTxHash}`);
      return unBondTxHash;
    } catch (error) {
      Logger.error('api::doUnBond error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @param wallet
   * @param stashAccountAddress
   * @param balances
   * @param stakingPreference
   * @param passphrase
   * @param statusCb
   * @returns {Promise<Function>}
   */
  doStake = async (
    wallet: CennznetWallet,
    stashAccountAddress: string,
    balances,
    stakingPreference,
    passphrase: string,
    statusCb: Function
  ): Promise<Function> => {
    Logger.debug('api::doStake called');
    Logger.debug(`api::doStake called, wallet ${JSON.stringify(wallet)}`);
    Logger.debug(`api::doStake called, stashAccountAddress ${JSON.stringify(stashAccountAddress)}`);
    Logger.debug(`api::doStake called, balances ${JSON.stringify(balances)}`);
    Logger.debug(`api::doStake called, stakingPreference ${JSON.stringify(stakingPreference)}`);
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(passphrase);
      Logger.debug('api::doStake unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('api::doStake setSigner');

      // bound
      const stakingAmount = new BN(
        balances[stashAccountAddress][PreDefinedAssetId.stakingToken].freeBalance.toString,
        10
      );
      Logger.debug(`api::doStake stakingAmount: ${stakingAmount}`);
      const controllerAccount = stashAccountAddress;
      const payee = [stashAccountAddress];
      const accountNonce = await this.api.query.system.accountNonce(controllerAccount);
      Logger.debug(`api::doStake accountNonce: ${accountNonce}`);
      const bondTxHash = await this.api.tx.staking
        .bond(controllerAccount, stakingAmount, payee)
        .signAndSend(controllerAccount, { nonce: accountNonce });
      Logger.debug(`api::doStake bondTxHash: ${bondTxHash}`);

      // query staking bonded account
      const bondedAccount = await this.api.query.staking.bonded(controllerAccount);
      Logger.debug(`api::doStake bondedAccount: ${bondedAccount}`);

      // query staking ledger
      const ledger = await this.api.query.staking.ledger(controllerAccount);
      Logger.debug(`api::doStake ledger: ${JSON.stringify(ledger)}`);

      //sessionKey account
      const seed = await this.getSeedFromWalletAccount(wallet, stashAccountAddress, passphrase);
      Logger.debug(`api::doStake seed: ${seed}`);
      const sessionKey = await this.getAddressFromSeed(seed);
      Logger.debug(`api::doStake sessionKey: ${sessionKey}`);

      // const sessionKey = '5Cgbad6GpEbsdb4YPLKgQ12qMW2gCie1FfqR7zBZdhynj257';
      // set sessionKey
      const setSessionKeyNonce = Number(String(accountNonce)) + 1;
      Logger.debug(`api::doStake newNonce: ${setSessionKeyNonce}`);

      const setSessionKeyTx = await this.api.tx.session
        .setKey(sessionKey)
        .signAndSend(controllerAccount, { nonce: setSessionKeyNonce });
      Logger.debug(`api::sessionKey setSessionKey: ${setSessionKeyTx}`);

      // validate
      // TODO preferences should pass in as param
      const preferences = stakingPreference;
      Logger.debug(`api::sessionKey stakingPreference: ${preferences}`);
      const newNonce = Number(String(accountNonce)) + 2;
      Logger.debug(`api::doStake newNonce: ${newNonce}`);
      const unsubscribeFn = await this.api.tx.staking
        .validate(preferences)
        .signAndSend(controllerAccount, { nonce: newNonce }, statusCb);
      Logger.debug(`api::doStake unsubscribeFn: ${unsubscribeFn}`);

      return unsubscribeFn;
    } catch (error) {
      Logger.error('api::doStake error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @deprecated
   * @param accountAddress
   * @returns {Promise<number>}
   */
  getIntentionIndex = async (accountAddress: string): Promise<number> => {
    Logger.debug('api::getIntentionIndex called');
    // try {
    //   const intentions = await this.api.query.staking.intentions();
    //   Logger.debug(`intentions: ${intentions}`);
    //   const intentionsStr = intentions.map(item => {
    //     return item.toString();
    //   });
    //   const intentionsIndex = intentionsStr.indexOf(accountAddress);
    //   return intentionsIndex;
    // } catch (error) {
    //   Logger.error('api::getIntentionIndex error: ' + stringifyError(error));
    //   throw new GenericApiError();
    // }
    return -1;
  };

  /**
   * @deprecated
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
    Logger.debug('api::saveStakingPreferences called');
    Logger.debug(`wallet: ${JSON.stringify(wallet)}`);
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(''); // TODO switch to pin code
      Logger.debug('api::saveStakingPreferences unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('api::saveStakingPreferences setSigner');

      const validatorPrefs = new ValidatorPrefs(prefs);
      const intentionIndex = await this.getIntentionIndex(accountAddress);
      const txHash = await this.api.tx.staking
        .registerPreferences(intentionIndex, validatorPrefs)
        .signAndSend(accountAddress);
      Logger.debug(`api::saveStakingPreferences txHash ${txHash}`);
      return txHash;
    } catch (error) {
      Logger.error('api::saveStakingPreferences error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @deprecated
   * @param accountAddress
   * @param callbackFn
   * @returns {Promise<ValidatorPrefs>}
   */
  getValidatorPreferences = async (
    accountAddress: string,
    callbackFn: Function
  ): Promise<ValidatorPrefs> => {
    Logger.debug('api::getValidatorPreferences called');
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
      Logger.error('api::getValidatorPreferences error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @param wallet
   * @param stashAccountAddress
   * @param passphrase
   * @param statusCb
   * @returns {Promise<Function>}
   */
  doUnStake = async (
    wallet: CennznetWallet,
    stashAccountAddress: string,
    passphrase: string,
    statusCb: Function
  ): Promise<Function> => {
    Logger.debug('api::doUnStake called');
    try {
      const originalWallet = this.reloadWallet(wallet);
      await originalWallet.unlock(passphrase);
      Logger.debug('api::doUnStake unlock');

      this.api.setSigner(originalWallet);
      Logger.debug('api::doUnStake setSigner');

      const controllerAccount = stashAccountAddress;

      // query staking ledger
      const ledger = await this.api.query.staking.ledger(controllerAccount);
      Logger.debug(`api::doUnStake ledger: ${JSON.stringify(ledger)}`);
      const bondedBalance = new BN(ledger.raw.active.toString(), 10);
      Logger.debug(`api::doUnStake bondedBalance: ${bondedBalance}`);

      // TODO not sure why bondedBalance always showing as 100?
      // unbond all amount from staking ledger
      const accountNonce = await this.api.query.system.accountNonce(controllerAccount);
      Logger.debug(`api::doUnStake accountNonce: ${accountNonce}`);
      const unBondTxHash = await this.api.tx.staking
        .unbond(bondedBalance)
        .signAndSend(controllerAccount, { nonce: accountNonce });
      Logger.debug(`api::doUnStake unBondTxHash: ${unBondTxHash}`);

      // chill
      const newNonce = Number(String(accountNonce)) + 1;
      Logger.debug(`api::doUnStake newNonce: ${newNonce}`);
      const unsubscribeFn = await this.api.tx.staking
        .chill()
        .signAndSend(controllerAccount, { nonce: newNonce }, statusCb);
      Logger.debug(`api::doUnStake unsubscribeFn: ${unsubscribeFn}`);

      // TODO: Chain epic to reflect the changes in reducer immediately
      await clearStorage(storageKeys.STAKING_STATUS);
      await clearStorage(storageKeys.STAKING_STASH_ACCOUNT_ADDRESS);
      await clearStorage(storageKeys.STAKING_STASH_WALLET_ID);

      return unsubscribeFn;
    } catch (error) {
      Logger.error('api::doUnStake error: ' + stringifyError(error));
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
    Logger.debug('api::doGenericAssetTransfer called');
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
      Logger.debug('addressDecode', addressDecode(toWalletAddress, true));

      const txHash = await this.api.tx.genericAsset
        .transfer(assetId, toWalletAddress, amount)
        .signAndSend(fromWalletAddress);
      Logger.debug(`api::doGenericAssetTransfer txHash ${txHash}`);
      return txHash;
    } catch (error) {
      Logger.error('api::doGenericAssetTransfer error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * The current set of validators.
   * @returns {Promise<List>}
   */
  getValidators = async (callbackFn: Function): Promise<List> => {
    Logger.debug('api::getValidators called');
    try {
      const validators = await this.api.query.session.validators(callbackFn);
      Logger.debug(`api::getValidators validators: ${JSON.stringify(validators)}`);
      return validators;
    } catch (error) {
      Logger.error('api::getValidators error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  /**
   * @param callbackFn
   * @returns {Promise<any>}
   */
  getSystemEvents = async (callbackFn: Function): Promise<any> => {
    Logger.debug('api::getSystemEvents called');
    try {
      const systemEvents = await this.api.query.system.events(callbackFn);
      Logger.debug(`api::getSystemEvents success: ${systemEvents}`);
      return systemEvents;
    } catch (error) {
      Logger.error('api::getSystemEvents error: ' + stringifyError(error));
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
    //   Logger.error('api::getIntentions error: ' + stringifyError(error));
    //   throw new GenericApiError();
    // }
  };

  /**
   * All the accounts with a desire to stake.
   * @returns {Promise<AccountIdList>}
   */
  // getIntentionsBalances = async (callbackFn: Function): Promise<AccountIdList> => {
  //   Logger.debug('api::getIntentionsBalances called');
  //   try {
  //     const intentionsBalances = await this.api.derive.staking.intentionsBalances(
  //       ...['balances'],
  //       callbackFn
  //     );
  //     Logger.debug(`api::getIntentionsBalances success: ${intentionsBalances}`);
  //     return intentionsBalances;
  //   } catch (error) {
  //     Logger.error('api::getIntentionsBalances error: ' + stringifyError(error));
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
      Logger.error('api::getSessions error: ' + stringifyError(error));
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
      Logger.error('api::getSessionProgress error: ' + stringifyError(error));
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
      Logger.error('api::getSessionLength error: ' + stringifyError(error));
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
      Logger.error('api::getEraProgress error: ' + stringifyError(error));
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
      Logger.error('api::getEraLength error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };
}
