import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';
import ROUTES from 'renderer/constants/routes';
import types from '../../types';

const mapDispatchToProps = dispatch => ({
  onJoinNetwork: payload => {
    dispatch({ type: types.storeNetworkOption.requested, payload });
  },
  onPageLoad: () => {
    // dispatch({
    //   type: types.streamStop.requested,
    //   payload: {},
    // });
  },
});

const selectedNetworkState = withState('selectedNetwork', 'setSelectedNetwork', null);
const uploadedFileState = withState('uploadedFile', 'setUploadedFile', null);

const enhance = lifecycle({
  componentDidMount() {
    this.props.onPageLoad();
  },
});

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  selectedNetworkState,
  uploadedFileState,
  enhance
);
