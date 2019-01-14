import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import ROUTES from 'renderer/constants/routes';
import types from '../../types';

const mapDispatchToProps = dispatch => ({
  onJoinNetwork: payload => {
    dispatch({ type: types.storeSelectedNetwork.triggered, payload });
  },
});

const enhance = withState('selectedNetwork', 'setSelectedNetwork', null);

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  enhance
);
