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


const setNodeSystemName = (state, { result }) => ({
  ...state,
  name: result
});

const setNodeSystemHealth = (state, health) => ({
  ...state,
  health
});

const handlers = {
  [types.nodeJsonRpcSystemName.completed]: setNodeSystemName,
  [types.nodeJsonRpcSystemHealth.completed]: setNodeSystemHealth
};

export default createChainFns(
  [
    setActionLoading(types.nodeJsonRpcSystemName),
    setActionLoading(types.nodeJsonRpcSystemHealth),
    handlers
  ],
  INITIAL_STATE,
);
