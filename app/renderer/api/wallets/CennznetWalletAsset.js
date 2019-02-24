// @flow
import BN from 'bn.js';

export default class CennznetWalletAsset {
  assetId: BN;
  address: string;
  name: string;
  freeBalance: BN;
  reservedBalance: BN;
  totalBalance: BN;

  constructor(data: {
    assetId: BN,
    address: string,
    name: string,
    freeBalance: BN,
    reservedBalance: BN,
    totalBalance: BN,
  }) {
    Object.assign(this, data);
  }

  // get totalBalance(): BN {
  //   return this.freeBalance.add(this.reservedBalance?this.reservedBalance: new BN(0, 10));
  // }
  //
  // get freeBalanceDisplay(): BN {
  //   return this.freeBalance;
  // }

}
