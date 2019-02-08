// @flow
import BN from 'bn.js';
import jdenticon from "jdenticon";

export default class CennznetWalletAsset {
  assetId: BN;
  address: string;
  iconBase64: string;
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
    this.iconBase64 = jdenticon.toPng(data.assetId.toString(10),200).toString('base64');
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
