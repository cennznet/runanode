import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { Logger } from 'renderer/utils/logging';
import types from '../../types';

const mapStateToProps = ({ staking }) => ({
  staking,
});

const mapDispatchToProps = dispatch => ({
  onUnStake: value => {
    window.odin.api.cennz.doUnStake(value.wallet, value.stashAccountAddress, value.passphrase);
  },
  onSaveStakingPreferences: value => {
    Logger.debug(`onSaveStakingPreferences: ${JSON.stringify(value)}`);
    dispatch({ type: types.stakingSavePreferences.requested, payload: value });
  },
  onGetValidatorPreferences: value => {
    dispatch({ type: types.stakingGetValidatorPreferences.requested, payload: value });
  },
});

const enhance = lifecycle({
  componentDidMount() {
    // TODO get current staking account info from redux store
    const { onGetValidatorPreferences } = this.props;
    const stakingAccountAddress = Object.keys(window.odin.store.getState().localStorage.WALLETS[0].accounts)[0];
    onGetValidatorPreferences(stakingAccountAddress);
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
