import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { storageKeys } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';
import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import types from 'renderer/types';
import { NetworkNameOptions } from 'common/types/cennznet-node.types';
import sreamConstants from 'renderer/constants/stream';
import ROUTES from 'renderer/constants/routes';

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

  navigateToCreateWallet: () => {
    dispatch({
      type: types.navigation.triggered,
      payload: ROUTES.WALLET.ROOT,
    });
  },
});

const enhance = lifecycle({
  componentDidMount() {
    const { localStorage } = this.props;
    const selectedNetwork = localStorage[storageKeys.SELECTED_NETWORK];
    const genesisConfigFile = localStorage[storageKeys.GENESIS_CONFIG_FILE_INFO];
    const genesisConfigFilePath = genesisConfigFile && genesisConfigFile.path;

    if (selectedNetwork === NetworkNameOptions.LOCAL_TESTNET) {
      this.props.onSyncLocalNetwork(genesisConfigFilePath);
    } else {
      this.props.onSyncRemoteNwtwork(this.props.localStorage.SELECTED_NETWORK);
    }
  },

  // TODO: time out err controller - progress bar red
  componentDidUpdate() {
    console.log('SyncNodePage ComponentDid update');
    const { blockNum: localBestBlock } = this.props.syncStream;
    const { blockNum: remoteBestBlock } = this.props.syncRemoteStream;
    if (localBestBlock && localBestBlock) {
      const syncPercentage = localBestBlock / localBestBlock;
      if (syncPercentage >= 1) {
        this.props.navigateToCreateWallet();
      }
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
