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
  onRestartNode: payload => {
    dispatch({ type: types.switchNetwork.triggered, payload });
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
    if (selectedNetwork === NetworkNameOptions.LOCAL_TESTNET && genesisConfigFilePath) {
      this.props.onRestartNode({ chian: genesisConfigFilePath });
    } else {
      this.props.onRestartNode({ chain: selectedNetwork });
    }
  },

  // TODO: time out err controller - progress bar red
  componentDidUpdate(prevProps) {
    /** Precentage */
    const { blockNum: localBestBlock } = this.props.syncStream;
    const { blockNum: remoteBestBlock } = this.props.syncRemoteStream;
    if (localBestBlock !== null && remoteBestBlock !== null) {
      const syncPercentage = localBestBlock / remoteBestBlock;
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
