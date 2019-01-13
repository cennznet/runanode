import { connect } from 'react-redux';
import types from 'renderer/types';

import {
  restartCennzNetNodeChannel,
} from 'renderer/ipc/cennznet.ipc';
import type { CennzNetRestartOptions } from 'common/types/cennznet-node.types';

const mapStateToProps = ({ nodeSystem, stream, remoteStream, syncStream, syncRemoteStream }) => ({ nodeSystem, stream, remoteStream, syncStream, syncRemoteStream });

const mapDispatchToProps = dispatch => ({
  onNetworkStatusClick: () => {
    dispatch({
      type: types.nodeJsonRpcSystem.requested,
      payload: {},
    });
  },
  onRestartNodeClick: () => {
    const options: CennzNetRestartOptions = {
      name: 'my-custom-node',
      chain: '/Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/dist/local.json'
    };
    restartCennzNetNodeChannel.send(options);
  },
  onStream: () => {
    dispatch({
      type: types.stream.requested,
      payload: {},
    });
    dispatch({
      type: types.remoteStream.requested,
      payload: {},
    });
    dispatch({
      type: types.syncStream.requested,
      payload: {},
    });
    dispatch({
      type: types.syncRemoteStream.requested,
      payload: {},
    });
  },
  onChainSubscribeNewHead: () => {
    dispatch({
      type: types.nodeWsChainSubscribeNewHead.requested,
      payload: {},
    });
  },

});

export default connect(mapStateToProps, mapDispatchToProps);
