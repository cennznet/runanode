import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {};

export default function stakingStore(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.updateEraProgress.triggered:
    case types.updateEraLength.triggered:
    case types.updateSessionLength.triggered:
    case types.updateSessionProgress.triggered:
    case types.updateValidators.triggered:
    case types.updateIntentions.triggered:
      return R.merge(state, {
        ...payload,
      });
    default:
      return state;
  }
}
