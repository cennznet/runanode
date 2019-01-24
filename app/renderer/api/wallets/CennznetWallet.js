// @flow
import BigNumber from 'bignumber.js';
import { Wallet } from 'cennznet-wallet';

export default class CennznetWallet {
  id: string = '';
  name: string = '';
  amount: BigNumber;
  hasPassword: boolean;
  wallet: Wallet;
  passwordUpdateDate: ?Date;

  constructor(data: {
    id: string,
    name: string,
    amount: BigNumber,
    hasPassword: boolean,
    wallet: Wallet,
    passwordUpdateDate: ?Date,
  }) {
    Object.assign(this, data);
  }

  get hasFunds(): boolean {
    return this.amount > 0;
  }

}
