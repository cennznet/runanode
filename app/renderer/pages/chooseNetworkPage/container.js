import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import ROUTES from 'renderer/constants/routes';
import types from '../../types';

const mapDispatchToProps = dispatch => ({
  onSelectNetwork: payload => {
    console.log('join--', payload);
    dispatch({ type: types.storeSelectedNetwork.triggered, payload });
  },

  onJoinNetwork: payload => {
    console.log('join--', payload);
    dispatch({ type: types.navigation.triggered, payload: ROUTES.SYNC_NODE });
  },
});

export default connect(
  null,
  mapDispatchToProps
);
