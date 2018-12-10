import R from 'ramda';
import types from 'renderer/types';

const DEFAULT_STATE = {
  text: '',
};

export default function testPage(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.testPage.triggered:
      return R.merge(state, {
        text: payload.text,
      });

    default:
      return state;
  }
}
