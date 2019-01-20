import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { ApiRx, ApiPromise } from '@polkadot/api';
import WsProvider from '@polkadot/rpc-provider/ws';
import typeRegistry from '@polkadot/types/codec/typeRegistry';
import { storageKeys } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';
import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import types from 'renderer/types';
import { NetworkNameOptions } from 'common/types/cennznet-node.types';
import sreamConstants from 'renderer/constants/stream';

const mapStateToProps = ({ syncStream, syncRemoteStream, localStorage }) => ({
  syncStream,
  syncRemoteStream,
  localStorage,
});

const mapDispatchToProps = dispatch => ({
  onSyncLocalNetwork: chain => {
    const options: CennzNetRestartOptions = {
      chain,
    };
    restartCennzNetNodeChannel.send(options);
  },

  onSyncRemoteNwtwork: () => {
    dispatch(
      {
        type: types.syncStream.requested,
        payload: { command: sreamConstants.CONNECT },
      },
      {
        type: types.syncRemoteStream.requested,
        payload: { command: sreamConstants.CONNECT },
      },
      {
        type: types.nodeWsSystemChainPolling.requested,
      }
    );
  },
});

const enhance = lifecycle({
  componentDidMount() {
    const { localStorage } = this.props;
    const selectedNetwork = localStorage[storageKeys.SELECTED_NETWORK];
    const genesisConfigFile = localStorage[storageKeys.GENESIS_CONFIG_FILE_INFO];

    if (selectedNetwork === NetworkNameOptions.LOCAL_TESTNET) {
      this.props.onSyncLocalNetwork(this.props.localStorage.GENESIS_CONFIG_FILE_INFO);
    } else {
      this.props.onSyncRemoteNwtwork(this.props.localStorage.SELECTED_NETWORK);
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
