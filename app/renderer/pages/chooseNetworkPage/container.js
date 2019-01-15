import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import ROUTES from 'renderer/constants/routes';
import types from '../../types';

const mapDispatchToProps = dispatch => ({
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
