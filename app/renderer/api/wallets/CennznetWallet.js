// @flow
import BN from 'bn.js';
import CennznetWalletAccount from './CennznetWalletAccount';

export default class CennznetWallet {
  id: string = '';
  name: string = '';
  hasPassword: boolean;
  wallet: Wallet;
  passwordUpdateDate: ?Date;

  defaultAccountPublicAddress: string;
  genericAssetNextAssetId: number;

  // staking token, assetId 0
  stakingTokenFreeBalance: BN;
  stakingTokenReservedBalance: BN;
  stakingTokenTotalSupply: BN;

  // spending token, assetId 10
  spendingTokenFreeBalance: BN;
  spendingTokenReservedBalance: BN;
  spendingTokenTotalSupply: BN;

  accounts: Map<string, CennznetWalletAccount>;

  constructor(data: {
    id: string,
    name: string,
    hasPassword: boolean,
    wallet: Wallet,
    passwordUpdateDate: ?Date,
    accounts: ?Map<string, CennznetWalletAccount>,
  }) {
    Object.assign(this, data);
  }

  // get hasFunds(): boolean {
  //   return this.amount > 0;
  // }
}
