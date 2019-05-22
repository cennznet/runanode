// @flow
import BN from 'bn.js';
import TheWalletAsset from './TheWalletAsset';

export default class TheWalletAccount {
  address: string;
  name: string;
  assets: Map<BN, TheWalletAsset>;

  constructor(data: { address: string, name: string, assets: ?Map<BN, TheWalletAsset> }) {
    Object.assign(this, data);
  }
}
