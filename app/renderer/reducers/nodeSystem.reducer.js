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

const handleChainGetHeader = (state, payload) => {
  const { localNode } = INITIAL_STATE;
  console.log('handleChainGetHeader');
  console.log(payload);

  localNode.bestBlock = payload.number;
  return {
    ...state,
    localNode,
  };
};

const handleSystemChain = (state, payload) => {
  const { localNode } = INITIAL_STATE;
  console.log('handleSystemChain');
  console.log(payload);

  localNode.chain = payload.result;
  return {
    ...state,
    chain: localNode.chain,
    localNode,
  };
};

const handlers = {
  [types.nodeJsonRpcSystemVersion.completed]: setNodeSystemVersion,
  [types.nodeJsonRpcSystemChain.completed]: setNodeSystemChain,
  [types.nodeJsonRpcSystemName.completed]: setNodeSystemName,
  [types.nodeJsonRpcSystemHealth.completed]: setNodeSystemHealth,
  [types.nodeWsChainGetHeader.completed]: handleChainGetHeader,
  [types.nodeWsSystemChain.completed]: handleSystemChain,
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
