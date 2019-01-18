import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';
import ROUTES from 'renderer/constants/routes';
import { storageKeys } from 'renderer/api/utils/storage';
import types from '../../types';

// const { SELECTED_NETWORK: select, GENESIS_CONFIG_FILE_PATH } = storageKeys;

const selectedNetwork = storageKeys.SELECTED_NETWORK;

const mapStateToProps = ({ localStorage }) => ({
  selectedNetwork: localStorage[storageKeys.SELECTED_NETWORK],
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

const uploadedFileState = withState('uploadedFile', 'setUploadedFile', null);

const enhance = lifecycle({
  componentDidMount() {},
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  uploadedFileState,
  enhance
);
