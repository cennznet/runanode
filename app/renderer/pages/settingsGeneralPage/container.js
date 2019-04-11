import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';

const mapStateToProps = ({ localStorage: { REMEMBER_NETWORK, ENABLE_ANALYTICS } }) => ({
  rememberNetwork: REMEMBER_NETWORK,
  enableAnalytics: ENABLE_ANALYTICS,
});

const mapDispatchToProps = dispatch => ({
  onToggleRememberNetwork: value => {
    dispatch({
      type: types.setStorage.requested,
      payload: { key: storageKeys.REMEMBER_NETWORK, value },
    });
  },
  onToggleEnableAnalytics: value => {
    dispatch({
      type: types.setStorage.requested,
      payload: { key: storageKeys.ENABLE_ANALYTICS, value },
    });
  },
  onResetStakingOption: () => {
    dispatch(
      {
        type: types.clearStorage.requested,
        payload: { key: storageKeys.STAKING_STASH_ACCOUNT_ADDRESS },
      },
      {
        type: types.clearStorage.requested,
        payload: { key: storageKeys.STAKING_STASH_WALLET_ID },
      },
    )
  }
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
