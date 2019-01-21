import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';
import ROUTES from 'renderer/constants/routes';
import { storageKeys } from 'renderer/api/utils/storage';
import types from '../../types';

const mapStateToProps = ({ localStorage }) => ({
  selectedNetwork: localStorage[storageKeys.SELECTED_NETWORK],
  genesisConfigFile: localStorage[storageKeys.GENESIS_CONFIG_FILE_INFO],
});

const mapDispatchToProps = dispatch => ({
  onJoinNetwork: payload => {
    dispatch({ type: types.storeNetworkOption.triggered, payload });
  },
});

const selectedNetworkState = withState('selectedNetwork', 'setSelectedNetwork', null);
const genesisFileState = withState('genesisFile', 'setUpGenesisFile', null);

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  selectedNetworkState,
  genesisFileState
);
