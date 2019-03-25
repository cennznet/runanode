import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {
  blockHeight: null,
  previousBlockHeight: null,
  updatedAt: null,
  bps: null,
};

export default function blocks(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.newHeadRemote.changed:
      return R.merge(state, {
        blockHeight: parseInt(payload.get('number'), 10),
        previousBlockHeight: state.blockHeight,
        updatedAt: Date.now(),
        bps:
          ((parseInt(payload.get('number'), 10) - state.previousBlockHeight) /
            (Date.now() - state.updatedAt)) *
            1000 || 0,
      });

    default:
      return state;
  }
}
