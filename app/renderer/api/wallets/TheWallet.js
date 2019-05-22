// @flow
import BN from 'bn.js';

import { WALLET_TYPE } from 'renderer/constants/wallet';
import TheWalletAccount from './TheWalletAccount';

export default class TheWallet {
  id: string = '';
  name: string = '';
  hasPassword: boolean;
  wallet: Wallet;
  passwordUpdateDate: ?Date;

  accounts: Map<string, TheWalletAccount>;

  type: WALLET_TYPE;

  constructor(data: {
    id: string,
    name: string,
    hasPassword: boolean,
    wallet: Wallet,
    passwordUpdateDate: ?Date,
    accounts: ?Map<string, TheWalletAccount>,
  }) {
    Object.assign(this, data);
  }

  // get hasFunds(): boolean {
  //   return this.amount > 0;
  // }
}
