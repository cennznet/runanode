import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {
  state: '', // theNode state
  status: '', // theNode status, extra status can handle by renderer, currently handle isNodeSafeExisting
  wsLocalStatus: '',
  wsRemoteStatus: '',
};

export default function nodeStateStore(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.nodeStateChange.triggered:
      return R.merge(state, {
        state: payload,
      });
    case types.theNodeStatusChange.triggered:
      return R.merge(state, {
        status: payload,
      });
    case types.wsLocalStatusChange.triggered:
      return R.merge(state, {
        wsLocalStatus: payload.type,
      });
    case types.wsRemoteStatusChange.triggered:
      return R.merge(state, {
        wsRemoteStatus: payload.type,
      });
    default:
      return state;
  }
}
