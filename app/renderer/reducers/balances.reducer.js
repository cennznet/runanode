import R from 'ramda';
import types from 'renderer/types';

const DEFAULT_STATE = {};

export default function balances(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.getAllAccountsBalances.completed:
      return R.merge(state, payload);

    default:
      return state;
  }
}
