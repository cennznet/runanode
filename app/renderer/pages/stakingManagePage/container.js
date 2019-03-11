import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import R from 'ramda';

import { Logger } from 'renderer/utils/logging';
import types from '../../types';
import { storageKeys } from '../../api/utils/storage';

const mapStateToProps = ({ staking, localStorage }) => ({
  staking,
  wallets: localStorage[storageKeys.WALLETS],
  stakingStashAccountAddress: localStorage[storageKeys.STAKING_STASH_ACCOUNT_ADDRESS],
  stakingStashWalletId: localStorage[storageKeys.STAKING_STASH_WALLET_ID],
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
    const { onSyncWalletData, wallets, stakingStashWalletId } = this.props;
    const wallet = wallets && R.find(R.propEq('id', stakingStashWalletId))(wallets);
    onSyncWalletData({ id: stakingStashWalletId, wallet });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
