import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { Logger } from 'renderer/utils/logging';
import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import types from 'renderer/types';
import { NetworkNameOptions } from 'common/types/cennznet-node.types';

const mapStateToProps = ({ syncStream, syncRemoteStream, localStorage }) => ({
  syncStream,
  syncRemoteStream,
  localStorage,
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
    const { selectedNetwork, uploadedFileInfo } = this.props.localStorage;

    if (selectedNetwork === NetworkNameOptions.LOCAL_TESTNET) {
      this.props.onSelectNetworkt(this.props.localStorage.GENESIS_CONFIG_FILE_PATH);
    } else {
      this.props.onSelectNetworkt(this.props.localStorage.SELECTED_NETWORK);
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
