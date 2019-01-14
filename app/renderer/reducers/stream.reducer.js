import createChainFns from 'renderer/helpers/reducerHelper';

import types from 'renderer/types';
import config from 'renderer/utils/config';

const INITIAL_STATE = {
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

const setStatus = (state, payload) => ({
  ...state,
  ...payload
});

const handlePing = (state, pingAt) => ({
  ...state,
  pingAt,
  pointAt: null
});

const handlePong = (state, pointAt) => ({
  ...state,
  ...parseLatency(state.pingAt, pointAt),
});

const handlers = {
  [types.streamStatus.changed]: setStatus,
  [types.streamPing.requested]: handlePing,
  [types.streamPing.completed]: handlePong,
};

export default createChainFns(handlers, INITIAL_STATE);
