import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import R from 'ramda';

import { Logger } from 'renderer/utils/logging';
import types from '../../types';
import { storageKeys } from '../../api/utils/storage';

const mapStateToProps = ({ appStore: { uiState }, staking, localStorage }) => ({
  uiState,
  staking,
  wallets: localStorage[storageKeys.WALLETS],
  stakingStashAccountAddress: localStorage[storageKeys.STAKING_STASH_ACCOUNT_ADDRESS],
  stakingStashWalletId: localStorage[storageKeys.STAKING_STASH_WALLET_ID],
});

const mapDispatchToProps = dispatch => ({
  onUnStake: payload => {
    Logger.debug('onUnStake');
    dispatch({ type: types.unStake.triggered, payload });
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
