import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import ROUTES from 'renderer/constants/routes';

const mapStateToProps = ({
  localStorage,
  nodeStateStore: { wsLocalStatus },
}) => ({
  wallets: localStorage[storageKeys.WALLETS],
  stakingStashAccountAddress: localStorage[storageKeys.STAKING_STASH_ACCOUNT_ADDRESS],
  stakingStashWalletId: localStorage[storageKeys.STAKING_STASH_WALLET_ID],
  wsLocalStatus,
});

const mapDispatchToProps = dispatch => ({
  onClickStakeButton: () => {
    dispatch({
      type: types.navigation.triggered,
      payload: ROUTES.STAKING.STAKE,
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
