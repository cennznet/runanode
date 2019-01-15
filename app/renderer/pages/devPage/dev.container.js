import { connect } from 'react-redux';
import types from 'renderer/types';

import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import type { CennzNetRestartOptions } from 'common/types/cennznet-node.types';
import ROUTES from 'renderer/constants/routes';

const mapStateToProps = ({ nodeSystem, syncStream, syncRemoteStream }) => ({
  nodeSystem,
  syncStream,
  syncRemoteStream,
});

const mapDispatchToProps = dispatch => ({
  onNetworkStatusClick: () => {
    dispatch({
      type: types.nodeWsSystemChainPolling.requested,
      payload: {},
    });
    // dispatch({
    //   type: types.nodeJsonRpcSystem.requested,
    //   payload: {},
    // });
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
      chain: '/Users/cherryliang/Work/cennz-node-ui/dist/local.json',
    };
    restartCennzNetNodeChannel.send(options);
  },
  onStream: () => {
    dispatch({
      type: types.syncStream.requested,
      payload: {},
    });
    dispatch({
      type: types.syncRemoteStream.requested,
      payload: {},
    });
  },
  onStreamStop: () => {
    // dispatch({
    //   type: types.streamStop.requested,
    //   payload: {},
    // });
  },
  onChainSubscribeNewHead: () => {
    dispatch({
      type: types.nodeWsChainSubscribeNewHead.requested,
      payload: {},
    });
  },
  onNavToChooseNetwork: () => {
    dispatch({type: types.navigation.triggered, payload: ROUTES.CHOOSE_NETWORK});
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
