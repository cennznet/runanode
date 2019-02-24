import createChainFns from 'renderer/helpers/reducerHelper';

import types from 'renderer/types';

const DEFAULT_STATE = {
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
    },
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
    },
  },
};

export default function localStorage(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.nodeJsonRpcSystemVersion.completed:
      return {
        ...state,
        version: payload.result,
      };

    case types.nodeJsonRpcSystemChain.completed:
      return {
        ...state,
        chain: payload.result,
      };

    case types.nodeJsonRpcSystemName.completed:
      return {
        ...state,
        name: payload.result,
      };
    case types.nodeJsonRpcSystemHealth.completed:
      return {
        ...state,
        health: payload,
      };

    case types.nodeWsChainGetHeader.completed:
      return {
        ...state,
        localNode: { ...state.localNode, bestBlock: payload.number },
      };

    case types.nodeWsSystemChain.completed:
      return {
        ...state,
        localNode: { ...state.localNode, chain: payload.result },
      };
    default:
      return state;
  }
}
