import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {
  state: '', // CENNZNETNode state
  status: '',
};

export default function networkStatusStore(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.networkStateChange.triggered:
      return R.merge(state, {
        state: payload,
      });
    case types.cenznetStatusChange.triggered:
      return R.merge(state, {
        status: payload,
      });
    default:
      return state;
  }
}
