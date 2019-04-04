import { connect } from 'react-redux';
import types from 'renderer/types';

const mapStateToProps = ({
  balances,
  localStorage: { WALLETS, STAKING_STASH_ACCOUNT_ADDRESS },
  transaction,
}) => ({
  balances,
  wallets: WALLETS,
  stakingStashAccountAddress: STAKING_STASH_ACCOUNT_ADDRESS,
  transaction,
});

const mapDispatchToProps = dispatch => ({
  onTransfer: payload => {
    dispatch({ type: types.transfer.requested, payload });
  },

  onConfirmAddAccount: payload => {
    dispatch({ type: types.addAccount.requested, payload });
  },

  onUpdateAccountName: payload => {
    dispatch({ type: types.updateAccountName.requested, payload });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
