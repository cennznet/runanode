import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {
  state: '', // CENNZNETNode state
  status: '', // CennzNetStatus status, extra status can handle by renderer, currently handle isNodeSafeExisting
};

export default function nodeStateStore(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.nodeStateChange.triggered:
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
