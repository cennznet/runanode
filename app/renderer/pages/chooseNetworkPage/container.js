import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import ROUTES from 'renderer/constants/routes';
import types from '../../types';

const mapDispatchToProps = dispatch => ({
  //   onUploadFile: payload => {
  //     dispatch({ type: types.storeLocalFilePath.triggered, payload });
  //   },
  //   onSelectNetwork: payload => {
  //     dispatch({ type: types.storeSelectedNetwork.triggered, payload });
  //   },
  onJoinNetwork: payload => {
    dispatch({ type: types.storeNetworkOption.requested, payload });
  },
});

const selectedNetworkState = withState('selectedNetwork', 'setSelectedNetwork', null);
const uploadedFileState = withState('uploadedFile', 'setUploadedFile', null);

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  selectedNetworkState,
  uploadedFileState
);
