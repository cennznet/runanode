import { connect } from 'react-redux';
import types from 'renderer/types';

import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import type { CennzNetRestartOptions } from 'common/types/cennznet-node.types';
import ROUTES from 'renderer/constants/routes';
import sreamConstants from 'renderer/constants/stream';
import { Logger } from 'renderer/utils/logging';

const mapStateToProps = ({ nodeSystem, syncStream, syncRemoteStream }) => ({
  nodeSystem,
  syncStream,
  syncRemoteStream,
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
      name: 'my-custom-node',
      chain: '/Users/benxgao/hackathon/cennz-node-ui/dist/local.json',
    };
    restartCennzNetNodeChannel.send(options);
  },
  onStreamStart: () => {
    dispatch({
      type: types.syncStream.requested,
      payload: { command: sreamConstants.CONNECT },
    });
  },
  onRemoteStreamStart: () => {
    dispatch({
      type: types.syncRemoteStream.requested,
      payload: { command: sreamConstants.CONNECT },
    });
  },
  onStreamStop: () => {
    dispatch({
      type: types.syncStream.requested,
      payload: { command: sreamConstants.DISCONNECT },
    });
  },
  onRemoteStreamStop: () => {
    dispatch({
      type: types.syncRemoteStream.requested,
      payload: { command: sreamConstants.DISCONNECT },
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
