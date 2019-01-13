import { connect } from 'react-redux';
import types from 'renderer/types';

import {
  restartCennzNetNodeChannel,
} from 'renderer/ipc/cennznet.ipc';
import type { CennzNetRestartOptions } from 'common/types/cennznet-node.types';

const mapStateToProps = ({ nodeSystem, stream }) => ({ nodeSystem, stream });

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
  },
  onChainSubscribeNewHead: () => {
    dispatch({
      type: types.nodeWsChainSubscribeNewHead.requested,
      payload: {},
    });
  },

});

export default connect(mapStateToProps, mapDispatchToProps);
