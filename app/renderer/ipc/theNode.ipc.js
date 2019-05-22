// @flow
import type {
  TheNodeState,
  TheNodeRestartOptions,
  TheNodeStatus,
  FaultInjectionIpcRequest,
  TlsConfig,
} from '../../common/types/theNode.types';
import { RendererIpcChannel } from './lib/RendererIpcChannel';
import {
  THENODE_FAULT_INJECTION_CHANNEL,
  THENODE_RESTART_CHANNEL,
  THENODE_STATE_CHANGE_CHANNEL,
  THENODE_STATUS_CHANNEL,
  THENODE_TLS_CONFIG_CHANNEL,
  THENODE_AWAIT_UPDATE_CHANNEL,
} from '../../common/ipc/api';

export const tlsConfigChannel: RendererIpcChannel<?TlsConfig, void> = new RendererIpcChannel(
  THENODE_TLS_CONFIG_CHANNEL
);

export const restartTheNetNodeChannel: RendererIpcChannel<?TheNodeRestartOptions,
  ?TheNodeRestartOptions> = new RendererIpcChannel(THENODE_RESTART_CHANNEL);

export const theNodeStateChangeChannel: RendererIpcChannel<TheNodeState,
  void> = new RendererIpcChannel(THENODE_STATE_CHANGE_CHANNEL);

export const awaitUpdateChannel: RendererIpcChannel<void, void> = new RendererIpcChannel(
  THENODE_AWAIT_UPDATE_CHANNEL
);

export const theNodeFaultInjectionChannel: RendererIpcChannel<void,
  FaultInjectionIpcRequest> = new RendererIpcChannel(THENODE_FAULT_INJECTION_CHANNEL);

export const theNodeStatusChannel: RendererIpcChannel<?TheNodeStatus,
  TheNodeStatus> = new RendererIpcChannel(THENODE_STATUS_CHANNEL);
