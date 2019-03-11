import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import R from 'ramda';

import { Logger } from 'renderer/utils/logging';
import types from '../../types';
import { storageKeys } from '../../api/utils/storage';

const mapStateToProps = ({ staking, localStorage }) => ({
  staking,
  wallets: localStorage[storageKeys.WALLETS],
});

const mapDispatchToProps = dispatch => ({
  onUnStake: value => {
    window.odin.api.cennz.doUnStake(value.wallet, value.stashAccountAddress, value.passphrase);
  },
  onSaveStakingPreferences: value => {
    Logger.debug(`onSaveStakingPreferences: ${JSON.stringify(value)}`);
    dispatch({ type: types.stakingSavePreferences.requested, payload: value });
  },
  onSyncWalletData: payload => {
    Logger.debug('onSyncWalletData');
    dispatch({ type: types.syncWalletData.requested, payload });
  },
});

const enhance = lifecycle({
  componentDidMount() {
    const { onSyncWalletData, wallets } = this.props;
    // TODO: get wallet from store
    const walletId = window.odin.store.getState().localStorage.WALLETS[0].id;
    const wallet = wallets && R.find(R.propEq('id', walletId))(wallets);
    onSyncWalletData({ id: walletId, wallet });
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
