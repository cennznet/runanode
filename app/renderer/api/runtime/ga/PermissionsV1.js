import { Struct } from '@plugnet/types';
import Owner from './Owner';

/**
 * alias for PermissionLatest and PermissionOptions
 */
export default class PermissionsV1 extends Struct {
  constructor(value: any) {
    super({ update: Owner, mint: Owner, burn: Owner }, value);
  }

  get update(): Owner {
    return this.get('update');
  }

  get mint(): Owner {
    return this.get('mint');
  }

  get burn(): Owner {
    return this.get('burn');
  }
}
