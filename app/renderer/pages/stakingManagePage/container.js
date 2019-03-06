import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { Logger } from 'renderer/utils/logging';
import types from '../../types';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onUnStake: value => {
    window.odin.api.cennz.doUnStake(value.wallet, value.stashAccountAddress, value.passphrase);
  },
  onSaveStakingPreferences: value => {
    Logger.debug(`onSaveStakingPreferences: ${JSON.stringify(value)}`);
    dispatch({ type: types.stakingSavePreferences.requested, payload: value });
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
