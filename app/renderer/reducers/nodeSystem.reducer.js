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

  remoteNode: {
    bestBlock: 0,
    chain: '',
    name: '',
    health: {
      code: 200,
      message: 'ok',
      isSyncing: '',
      peers: 0,
    }
  },
  localNode: {
    bestBlock: 0,
    chain: '',
    name: '',
    health: {
      code: 200,
      message: 'ok',
      isSyncing: '',
      peers: 0,
    }
  }
};

const setNodeSystemVersion = (state, { result }) => ({
  ...state,
  version: result
});

const setNodeSystemChain = (state, { result }) => ({
  ...state,
  chain: result
});

const setNodeSystemName = (state, { result }) => ({
  ...state,
  name: result
});

const setNodeSystemHealth = (state, health) => ({
  ...state,
  health
});

const setNodeSystemStateFromPayload = (state, payload) => {
  const { health } = INITIAL_STATE;

  if(payload.error && payload.error.data) {
    health.code = payload.error.code;
    health.message = payload.error.message;
    health.isSyncing = payload.error.data.is_syncing;
    health.peers = payload.error.data.peers;
  }

  if(payload.result) {
    health.isSyncing = payload.result.is_syncing ? payload.result.is_syncing : health.isSyncing;
    health.peers = payload.result.peers ? payload.result.peers : health.peers;;
  }
  return {
    ...state,
    health,
  };
};

const handlers = {
  [types.nodeJsonRpcSystemVersion.completed]: setNodeSystemVersion,
  [types.nodeJsonRpcSystemChain.completed]: setNodeSystemChain,
  [types.nodeJsonRpcSystemName.completed]: setNodeSystemName,
  [types.nodeJsonRpcSystemHealth.completed]: setNodeSystemHealth,
  [types.streamMessage.changed]: setNodeSystemStateFromPayload,
};

export default createChainFns(
  [
    setActionLoading(types.nodeJsonRpcSystemVersion),
    setActionLoading(types.nodeJsonRpcSystemChain),
    setActionLoading(types.nodeJsonRpcSystemName),
    setActionLoading(types.nodeJsonRpcSystemHealth),
    handlers
  ],
  INITIAL_STATE,
);
