import { connect } from 'react-redux';
import types from 'renderer/types';

import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import type { CennzNetRestartOptions } from 'common/types/cennznet-node.types';
import ROUTES from 'renderer/constants/routes';
import streamConstants from 'renderer/constants/stream';
import { Logger } from 'renderer/utils/logging';
import { NetworkNameOptions } from 'common/types/cennznet-node.types';

const mapStateToProps = ({ nodeSystem, syncStream, syncRemoteStream, networkStatusStore }) => ({
  nodeSystem,
  syncStream,
  syncRemoteStream,
  networkStatusStore,
});

const mapDispatchToProps = dispatch => ({
  onNetworkStatusClick: () => {
    Logger.debug('onNetworkStatusClick debug');
    // dispatch({
    //   type: types.nodeWsSystemChainPolling.requested,
    //   payload: {},
    // });
    dispatch({
      type: types.nodeJsonRpcSystem.requested,
      payload: {},
    });
  },
  onGetHeaderClick: () => {
    // dispatch({
    //   type: types.nodeWsChainGetHeader.requested,
    //   payload: {},
    // });
    dispatch({
      type: types.nodeWsChainGetHeaderPolling.requested,
      payload: {},
    });
  },
  onGetRemoteHeaderClick: () => {
    dispatch({
      type: types.nodeWsRemoteChainGetHeader.requested,
      payload: {},
    });
  },
  onRestartNodeClick: () => {
    const options: CennzNetRestartOptions = {
      chain: NetworkNameOptions.CENNZNET_UAT,
    };
    restartCennzNetNodeChannel.send(options);
  },
  onStreamStart: () => {
    dispatch({
      type: types.syncStream.requested,
      payload: { command: streamConstants.CONNECT },
    });
  },
  onRemoteStreamStart: () => {
    dispatch({
      type: types.syncRemoteStream.requested,
      payload: { command: streamConstants.CONNECT },
    });
  },
  onStreamStop: () => {
    dispatch({
      type: types.syncStream.requested,
      payload: { command: streamConstants.DISCONNECT },
    });
  },
  onRemoteStreamStop: () => {
    dispatch({
      type: types.syncRemoteStream.requested,
      payload: { command: streamConstants.DISCONNECT },
    });
  },
  onChainSubscribeNewHead: () => {
    dispatch({
      type: types.nodeWsChainSubscribeNewHead.requested,
      payload: {},
    });
  },
  onNavToChooseNetwork: () => {
    dispatch({ type: types.navigation.triggered, payload: ROUTES.CHOOSE_NETWORK });
    dispatch({ type: types.resetLocalStorage.triggered });
  },
  onResetLocalStorage: () => {
    dispatch({ type: types.resetLocalStorage.triggered });
  },
  onWalletCreate: () => {
    dispatch({ type: types.walletCreate.requested });
  },
  onWalletPaperGenerate: ( payload ) => {
    dispatch({ type: types.walletPaperGenerate.requested, payload });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
