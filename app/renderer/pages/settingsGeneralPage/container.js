import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';

const mapStateToProps = ({ localStorage: { REMEMBER_NETWORK } }) => ({
  rememberNetwork: REMEMBER_NETWORK,
});

const mapDispatchToProps = dispatch => ({
  onToggleRememberNetwork: value => {
    dispatch({
      type: types.setStorage.requested,
      payload: { key: storageKeys.REMEMBER_NETWORK, value },
    });
  },
});

const enhance = lifecycle({
  componentDidMount() {},
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
