import { connect } from 'react-redux';
import { compose, withState, withStateHandlers } from 'recompose';
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
});

const enhance = compose(
  withState('isAddAccountModalOpen', 'setAddAccountModalOpen', false),
  withState('initAccountNameInput', 'setInitAccountNameInput', true),

  withStateHandlers(
    ({ initToUpdateWallet = null }) => ({
      toUpdateWallet: initToUpdateWallet,
    }),
    {
      setToUpdateWallet: () => val => ({ toUpdateWallet: val }),
    }
  )
);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
