import { connect } from 'react-redux';
import ROUTES from 'renderer/constants/routes';
import { storageKeys } from 'renderer/api/utils/storage';
import types from '../../types';

const mapDispatchToProps = dispatch => ({
  onJoinNetwork: payload => {
    dispatch({ type: types.storeNetworkOption.triggered, payload });
  },
});

export default connect(
  null,
  mapDispatchToProps
);
