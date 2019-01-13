import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {
  rememberNetwork: null,
};

export default function settings(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.getRememberNetwork.completed:
      return R.merge(state, {
        rememberNetwork: payload,
      });
    case types.toggleRememberNetwork.completed:
      return R.merge(state, {
        rememberNetwork: payload,
      });
    default:
      return state;
  }
}
