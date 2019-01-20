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
  onSelectNetwork: payload => {
    dispatch({ type: types.storeNetworkOption.triggered, payload });
  },
  onUploadGenesisFile: payload => {
    dispatch({ type: types.storeUploadedGenesisInfo.triggered, payload });
  },
  onJoinNetwork: () => {
    dispatch({ type: types.navigation.triggered, payload: ROUTES.SYNC_NODE });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
