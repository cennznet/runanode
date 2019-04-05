// @flow
import type {
  CennzNetNodeState,
  CennzNetRestartOptions,
  CennzNetStatus,
  FaultInjectionIpcRequest,
  TlsConfig,
} from '../../common/types/cennznet-node.types';
import { RendererIpcChannel } from './lib/RendererIpcChannel';
import {
  CENNZNET_FAULT_INJECTION_CHANNEL,
  CENNZNET_RESTART_CHANNEL,
  CENNZNET_STATE_CHANGE_CHANNEL,
  CENNZNET_STATUS_CHANNEL,
  CENNZNET_TLS_CONFIG_CHANNEL,
  CENNZNET_AWAIT_UPDATE_CHANNEL,
} from '../../common/ipc/api';

export const tlsConfigChannel: RendererIpcChannel<?TlsConfig, void> = new RendererIpcChannel(
  CENNZNET_TLS_CONFIG_CHANNEL
);

export const restartCennzNetNodeChannel: RendererIpcChannel<?CennzNetRestartOptions,
  ?CennzNetRestartOptions> = new RendererIpcChannel(CENNZNET_RESTART_CHANNEL);

export const cennznetStateChangeChannel: RendererIpcChannel<CennzNetNodeState,
  void> = new RendererIpcChannel(CENNZNET_STATE_CHANGE_CHANNEL);

export const awaitUpdateChannel: RendererIpcChannel<void, void> = new RendererIpcChannel(
  CENNZNET_AWAIT_UPDATE_CHANNEL
);

export const cennznetFaultInjectionChannel: RendererIpcChannel<void,
  FaultInjectionIpcRequest> = new RendererIpcChannel(CENNZNET_FAULT_INJECTION_CHANNEL);

export const cennznetStatusChannel: RendererIpcChannel<?CennzNetStatus,
  CennzNetStatus> = new RendererIpcChannel(CENNZNET_STATUS_CHANNEL);
