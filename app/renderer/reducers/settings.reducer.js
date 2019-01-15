import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {
  rememberNetwork: null,
  selectedNetwork: null,
  uploadedFileInfo: null,
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
    case types.getSelectedNetwork.completed:
      return R.merge(state, {
        selectedNetwork: payload,
      });
    case types.getUploadedFileInfo.completed:
      return R.merge(state, {
        uploadedFileInfo: payload,
      });

    default:
      return state;
  }
}
