import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {
  text: '',
  selectedNetwork: null,
  bestBlock: 0,
  syncedBlock: 0,
};

export default function testPage(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.updateBestBlock.triggered:
      return R.merge(state, {
        bestBlock: payload,
      });

    case types.updateSyncedBlock.triggered:
      return R.merge(state, {
        syncedBlock: payload,
      });

    default:
      return state;
  }
}
