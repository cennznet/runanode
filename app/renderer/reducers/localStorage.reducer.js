import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {
  WALLETS: [
    { id: 'asdfasadsf23dfqwfw', name: 'Wallet 1', amount: 41412 },
    { id: 'by324dfwe234dfhg53', name: 'Wallet 2', amount: 41412 },
    { id: 'c36sdfwe234kljjkhk', name: 'Wallet 3', amount: 41412 },
  ],
};

export default function localStorage(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.getStorage.completed:
    case types.setStorage.completed:
    case types.clearStorage.completed:
      return R.merge(state, {
        [payload.key]: payload.value,
      });
    default:
      return state;
  }
}
