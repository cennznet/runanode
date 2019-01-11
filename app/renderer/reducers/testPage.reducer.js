import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {
  text: '',
  mainNetBestBlock: 0,
  localNetBestBlock: 0,
};

export default function testPage(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.testPage.triggered:
      return R.merge(state, {
        text: payload.text,
      });

    case types.updateMainNetBestBlock.triggered:
      return R.merge(state, {
        mainNetBestBlock: payload,
      });

    case types.updateLocalNetBestBlock.triggered:
      return R.merge(state, {
        localNetBestBlock: payload,
      });

    default:
      return state;
  }
}
