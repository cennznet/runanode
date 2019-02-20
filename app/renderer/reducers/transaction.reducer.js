import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {
  txHash: '',
};

export default function localStorage(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.transfer.completed:
      return R.merge(state, payload);
    default:
      return state;
  }
}
