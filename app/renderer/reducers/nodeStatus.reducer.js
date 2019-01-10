import createChainFns from 'common/helpers/reducerHelper';
import { setActionLoading, initialState } from 'common/helpers/uiReducer';
import types from 'common/types/types';

const INITIAL_STATE = {
  ...initialState,
  chain: '',
  name: '',
  health: {
    code: 200,
    message: 'ok',
    isSyncing: '',
    peers: 0,
  },
  version: '',
};


const setNodeApiSystemName = (state, { result }) => ({
  ...state,
  name: result
});

const setNodeApiSystemHealth = (state, health) => ({
  ...state,
  health
});

const handlers = {
  [types.nodeApiSystemName.completed]: setNodeApiSystemName,
  [types.nodeApiSystemHealth.completed]: setNodeApiSystemHealth
};

export default createChainFns(
  [
    setActionLoading(types.nodeApiSystemName),
    setActionLoading(types.nodeApiSystemHealth),
    handlers
  ],
  INITIAL_STATE,
);
