import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import R from 'ramda';

import { Logger } from 'renderer/utils/logging';
import { storageKeys } from 'renderer/api/utils/storage';
import types from '../../types';

const mapStateToProps = ({
  appStore: { uiState },
  balances,
  staking,
  localStorage,
  nodeStateStore: { wsLocalStatus },
}) => ({
  balances,
  uiState,
  staking,
  wallets: localStorage[storageKeys.WALLETS],
  stakingStashAccountAddress: localStorage[storageKeys.STAKING_STASH_ACCOUNT_ADDRESS],
  stakingStashWalletId: localStorage[storageKeys.STAKING_STASH_WALLET_ID],
  wsLocalStatus,
});

const mapDispatchToProps = dispatch => ({
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
