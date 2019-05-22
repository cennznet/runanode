// @flow
import type {
  TheNodeState,
  TheNodeRestartOptions,
  TheNodeStatus,
  FaultInjectionIpcRequest,
  TlsConfig,
} from '../../common/types/theNode.types';
import { MainIpcChannel } from './lib/MainIpcChannel';
import {
  THENODE_FAULT_INJECTION_CHANNEL,
  THENODE_RESTART_CHANNEL,
  THENODE_STATE_CHANGE_CHANNEL,
  THENODE_STATUS_CHANNEL,
  THENODE_TLS_CONFIG_CHANNEL,
  THENODE_AWAIT_UPDATE_CHANNEL,
} from '../../common/ipc/api';

// IpcChannel<Incoming, Outgoing>

export const theNodeRestartChannel: MainIpcChannel<?TheNodeRestartOptions,
  ?TheNodeRestartOptions> = new MainIpcChannel(THENODE_RESTART_CHANNEL);

export const theNodeTlsConfigChannel: MainIpcChannel<void, ?TlsConfig> = new MainIpcChannel(
  THENODE_TLS_CONFIG_CHANNEL
);

export const theNodeAwaitUpdateChannel: MainIpcChannel<void, void> = new MainIpcChannel(
  THENODE_AWAIT_UPDATE_CHANNEL
);

export const theNodeStateChangeChannel: MainIpcChannel<void, TheNodeState> = new MainIpcChannel(
  THENODE_STATE_CHANGE_CHANNEL
);

export const theNodeFaultInjectionChannel: MainIpcChannel<FaultInjectionIpcRequest,
  void> = new MainIpcChannel(THENODE_FAULT_INJECTION_CHANNEL);

export const theNodeStatusChannel: MainIpcChannel<TheNodeStatus,
  ?TheNodeStatus> = new MainIpcChannel(THENODE_STATUS_CHANNEL);
