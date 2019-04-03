import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {
  uiState: {
    isProcessing: false,
    message: '',
  },
  notificationBar: {
    type: '',
  },
  globalModal: {
    isOpen: false,
    type: '',
  },
};

export default function appStore(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.changeAppUiState.triggered:
      return R.merge(state, {
        uiState: payload,
      });

    case types.resetAppUiState.triggered:
      return R.merge(state, {
        uiState: DEFAULT_STATE.uiState,
      });

    case types.notificationBar.triggered:
      return R.merge(state, {
        notificationBar: payload,
      });

    case types.toggleGlobalModal.triggered:
      return R.merge(state, {
        globalModal: {
          isOpen: payload.isOpen,
          type: payload.type,
        },
      });

    default:
      return state;
  }
}
