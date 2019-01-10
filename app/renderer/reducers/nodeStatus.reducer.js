import createChainFns from 'renderer/helpers/reducerHelper';
import { setActionLoading, initialState } from 'renderer/helpers/uiReducer';
import types from 'renderer/types';

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
