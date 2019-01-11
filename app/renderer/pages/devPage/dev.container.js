import { connect } from 'react-redux';
import types from 'renderer/types';

import {
  restartCennzNetNodeChannel,
} from 'renderer/ipc/cennznet.ipc';
import type { CennzNetRestartOptions } from '../../../common/types/cennznet-node.types';

const mapStateToProps = ({ dev }) => ({ dev });

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


});

export default connect(mapStateToProps, mapDispatchToProps);
