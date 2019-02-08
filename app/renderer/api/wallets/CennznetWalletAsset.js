// @flow
import BN from 'bn.js';

export default class CennznetWalletAsset {
  assetId: BN;
  address: string;
  name: string;
  freeBalance: BN;
  reservedBalance: BN;

  constructor(data: {
    assetId: BN,
    address: string,
    name: string,
    freeBalance: ?BN,
    reservedBalance: ?BN,
  }) {
    Object.assign(this, data);
  }

}
