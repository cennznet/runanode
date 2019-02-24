import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {};

export default function localStorage(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.getStorage.completed:
    case types.setStorage.completed:
    case types.clearStorage.completed:
      return R.merge(state, {
        [payload.key]: payload.value,
      });
    case types.syncWalletData.completed:
      return R.merge(state, {
        WALLETS: payload.wallets,
      });
    default:
      return state;
  }
}
