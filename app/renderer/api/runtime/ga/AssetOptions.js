/*
 Custom `AssetOptions` type for generic asset module.
*/

import { Balance, Compact, Struct } from '@polkadot/types';
import { PermissionLatest } from '.';

export default class AssetOptions extends Struct {
  constructor(value: any) {
    super({ initialIssuance: Compact.with(Balance), permissions: PermissionLatest }, value);
  }

  get initialIssuance(): Balance {
    return this.get('initialIssuance');
  }

  get permissions(): PermissionLatest {
    return this.get('permissions');
  }
}
