// @flow
import BN from 'bn.js';
import CennznetWalletAsset from './CennznetWalletAsset';

export default class CennznetWalletAccount {
  address: string;
  assets: Map<BN, CennznetWalletAsset>;

  constructor(data: {
    address: string,
    assets: ?Map<BN, CennznetWalletAsset>
  }) {
    Object.assign(this, data);
  }

}
