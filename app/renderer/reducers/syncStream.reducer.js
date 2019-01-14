import createChainFns from 'renderer/helpers/reducerHelper';

import types from 'renderer/types';
import config from 'renderer/utils/config';

const INITIAL_STATE = {
  blockNum: 0,
  previousBlockNum: 0,
  bps: 0,
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

const handlePongWithPayload = (state, payload) => {
  const blockNum = payload.number;
  const previousBlockNum = state.blockNum;
  const bps = (blockNum - previousBlockNum) / config.connectivity.latency.period * 1000;
  return ({
    ...state,
    ...parseLatency(state.pingAt, Date.now()),
    blockNum,
    previousBlockNum,
    bps
  });
};

const streamStatusType = types.syncStreamStatus;
const streamPingType = types.syncStreamPing;
const handlers = {
  [streamStatusType.changed]: setStatus,
  [streamPingType.requested]: handlePing,
  [streamPingType.completed]: handlePongWithPayload,
  [types.nodeWsChainGetHeader.completed]: handlePongWithPayload,
};

export default createChainFns(handlers, INITIAL_STATE);
