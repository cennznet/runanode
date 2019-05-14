import { AccountId, Option } from '@plugnet/types';

export default class Owner extends Option.with(AccountId) {
}
