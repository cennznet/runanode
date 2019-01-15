import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { ApiRx, ApiPromise } from '@polkadot/api';
import WsProvider from '@polkadot/rpc-provider/ws';
import typeRegistry from '@polkadot/types/codec/typeRegistry';
import { Logger } from 'renderer/utils/logging';
import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import types from '../../types';
import { NetworkNameOptions } from '../../../common/types/cennznet-node.types';

const mapStateToProps = ({ syncStream, syncRemoteStream, settings }) => ({
  syncStream,
  syncRemoteStream,
  settings,
});

const mapDispatchToProps = dispatch => ({
  // Handle with the detailed network option in next PR
  onSyncRemoteStream: () => {
    dispatch({
      type: types.syncRemoteStream.requested,
      payload: {},
    });
  },

  onSyncStream: () => {
    dispatch({
      type: types.syncStream.requested,
      payload: {},
    });
  },
  onSelectNetworkt: chain => {
    const options: CennzNetRestartOptions = {
      chain,
    };
    restartCennzNetNodeChannel.send(options);
  },
});

const enhance = lifecycle({
  componentDidMount() {
    const { selectedNetwork, uploadedFileInfo } = this.props.settings;

    if (selectedNetwork === NetworkNameOptions.localTestNet) {
      this.props.onSelectNetworkt(uploadedFileInfo);
    } else {
      this.props.onSelectNetworkt(selectedNetwork);
    }
    // this.props.onSyncStream();
    // this.props.onSyncRemoteStream();
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
