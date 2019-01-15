import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { ApiRx, ApiPromise } from '@polkadot/api';
import WsProvider from '@polkadot/rpc-provider/ws';
import typeRegistry from '@polkadot/types/codec/typeRegistry';
import { Logger } from 'renderer/utils/logging';
import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import types from '../../types';

const mapStateToProps = ({ syncStream, syncRemoteStream, settings }) => ({
  syncStream,
  syncRemoteStream,
  settings,
});

const mapDispatchToProps = dispatch => ({
  // Hanle with the detailed network option in next PR
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
  onSyncLocalTestnet: localFilePath => {
    const options: CennzNetRestartOptions = {
      name: 'local-test-net',
      chain: localFilePath,
    };
    restartCennzNetNodeChannel.send(options);
  },
});

const enhance = lifecycle({
  componentDidMount() {
    const { selectedNetwork, uploadedFileInfo } = this.props.settings;
    console.log('syncNode page:', selectedNetwork);
    console.log('syncNode page:', uploadedFileInfo);

    if (selectedNetwork === 'localTestNet') {
      this.props.onSyncLocalTestnet(uploadedFileInfo);
    } else {
      this.props.onSyncStream();
      this.props.onSyncRemoteStream();
    }
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
