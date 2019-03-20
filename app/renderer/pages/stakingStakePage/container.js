import { connect } from 'react-redux';
import types from 'renderer/types';

import { Logger } from 'renderer/utils/logging';

const mapStateToProps = ({ appStore: { uiState }, localStorage: { WALLETS, STAKING_PREFERENCE }, balances }) => ({
  uiState,
  wallets: WALLETS,
  stakingPreference: STAKING_PREFERENCE,
  balances,
});

const mapDispatchToProps = dispatch => ({
  onSaveStakingPreferences: value => {
    Logger.debug(`onSaveStakingPreferences: ${JSON.stringify(value)}`);
    dispatch({ type: types.stakingSavePreferences.requested, payload: value });
  },
  onStake: payload => {
    dispatch({
      type: types.stake.triggered,
      payload,
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
