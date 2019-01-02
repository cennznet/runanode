// @flow
import type {
  CennzNetNodeState, CennzNetStatus,
  FaultInjectionIpcRequest,
  TlsConfig
} from '../../common/types/cennznet-node.types';
import { MainIpcChannel } from './lib/MainIpcChannel';
import {
  CENNZNET_FAULT_INJECTION_CHANNEL,
  CENNZNET_RESTART_CHANNEL,
  CENNZNET_STATE_CHANGE_CHANNEL,
  CENNZNET_STATUS_CHANNEL,
  CENNZNET_TLS_CONFIG_CHANNEL,
  CENNZNET_AWAIT_UPDATE_CHANNEL
} from '../../common/ipc/api';

// IpcChannel<Incoming, Outgoing>

export const cennznetRestartChannel: MainIpcChannel<void, void> = (
  new MainIpcChannel(CENNZNET_RESTART_CHANNEL)
);

export const cennznetTlsConfigChannel: MainIpcChannel<void, ?TlsConfig> = (
  new MainIpcChannel(CENNZNET_TLS_CONFIG_CHANNEL)
);

export const cennznetAwaitUpdateChannel: MainIpcChannel<void, void> = (
  new MainIpcChannel(CENNZNET_AWAIT_UPDATE_CHANNEL)
);

export const cennznetStateChangeChannel: MainIpcChannel<void, CennzNetNodeState> = (
  new MainIpcChannel(CENNZNET_STATE_CHANGE_CHANNEL)
);

export const cennznetFaultInjectionChannel: MainIpcChannel<FaultInjectionIpcRequest, void> = (
  new MainIpcChannel(CENNZNET_FAULT_INJECTION_CHANNEL)
);

export const cennznetStatusChannel: MainIpcChannel<CennzNetStatus, ?CennzNetStatus> = (
  new MainIpcChannel(CENNZNET_STATUS_CHANNEL)
);
