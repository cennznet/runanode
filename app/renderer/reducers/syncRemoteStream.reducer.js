import createChainFns from 'renderer/helpers/reducerHelper';

import types from 'renderer/types';
import config from 'renderer/utils/config';

const DEFAULT_STATE = {
  blockNum: null,
  previousBlockNum: null,
  bps: null,
  isConnected: false,
  isConnecting: false,
  isAuthenticated: false,
  pingAt: null,
  pongAt: null,
  latency: null,
  signalLevel: null,
};

const parseLatency = (pingAt, pongAt) => {
  if (!pingAt || !pongAt) {
    return { pongAt };
  }

  const latency = pongAt - pingAt;
  if (latency < 0) {
    return {};
  }

  const { full, medium, weak } = config.connectivity.latency.signalLevel;
  const level = [full, medium, weak].find(l => latency >= l.latency[0] && latency < l.latency[1]);

  if (level) {
    return {
      pongAt,
      latency,
      signalLevel: level.level,
    };
  }

  return { pongAt, latency };
};

export default function localStorage(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.syncRemoteStreamStatus.changed:
      return {
        ...state,
        ...payload,
      };
    case types.syncRemoteStreamPing.requested:
      return {
        ...state,
        ...payload,
      };
    case types.syncRemoteStreamPing.completed:
      return {
        ...state,
        ...parseLatency(state.pingAt, Date.now()),
        blockNum: parseInt(payload.number, 16),
        previousBlockNum: state.blockNum,
        bps:
          ((parseInt(payload.number, 16) - state.blockNum) / config.connectivity.latency.period) *
          1000,
      };

    case types.nodeWsRemoteChainGetHeader.completed:
      return {
        ...state,
        ...parseLatency(state.pingAt, Date.now()),
        blockNum: parseInt(payload.number, 16),
        previousBlockNum: state.blockNum,
        bps:
          ((parseInt(payload.number, 16) - state.blockNum) / config.connectivity.latency.period) *
          1000,
      };

    default:
      return state;
  }
}
