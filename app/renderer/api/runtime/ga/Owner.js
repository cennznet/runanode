import { AccountId, Option } from '@polkadot/types';

export default class Owner extends Option.with(AccountId) {
}
