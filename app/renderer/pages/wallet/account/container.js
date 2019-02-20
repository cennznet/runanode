import { connect } from 'react-redux';
import { compose, lifecycle, withState, withStateHandlers } from 'recompose';
import { lensProp, set, find, propEq } from 'ramda';

import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import history from 'renderer/history';
import ROUTES from 'renderer/constants/routes';
import { Logger } from 'renderer/utils/logging';

const mapStateToProps = ({ localStorage }) => ({ wallets: localStorage[storageKeys.WALLETS] });

const mapDispatchToProps = dispatch => ({
  onPageLoaded: payload => {},
  onSyncWalletData: payload => {
    Logger.debug('onSyncWalletData');
    dispatch({ type: types.syncWalletData.requested, payload });
  },

  onTransfer: payload => {
    Logger.debug('onTransfer');
    dispatch({ type: types.transfer.requested, payload });
  },

  onAddAccount: async walletItem => {
    const { wallet } = walletItem;
    const { updatedWallet, newAccount } = await window.odin.api.cennz.addAccount({ wallet });
    if (newAccount) {
      const resolvedWalletItem = set(lensProp('wallet'), updatedWallet, walletItem);
      const syncedWallet = await window.odin.api.cennz.syncWalletData(resolvedWalletItem);
      return { syncedWallet, newAccount };
    }
    /**
     * TODO:
     * Failure toaster if no new account
     */
  },

  onConfirmAddAccount: payload => {
    dispatch({ type: types.addAccount.requested, payload });
  },
});

const enhance = compose(
  lifecycle({
    componentDidMount() {
      Logger.debug('componentDidMount');
      Logger.debug(this.props);

      // sync wallet data on page load
      const { onSyncWalletData, match, wallets } = this.props;
      const { walletId, accountPublicAddress } = match.params;
      const wallet = find(propEq('id', walletId))(wallets);
      onSyncWalletData({ id: walletId, wallet });
    },

    componentDidUpdate(prevProps) {
      // sync wallet data when nav to different account
      if (this.props.match.params.walletId !== prevProps.match.params.walletId) {
        Logger.debug('sync wallet data on different wallet Id');
        const { onSyncWalletData, match, wallets } = this.props;
        const { walletId, accountPublicAddress } = match.params;
        const wallet = find(propEq('id', walletId))(wallets);
        onSyncWalletData({ id: walletId, wallet });
      }
    },
  }),
  withState('isAddAccountModalOpen', 'setAddAccountModalOpen', false),
  withState('newAccountName', 'setNewAccountName', null),
  withState('initAccountNameInput', 'setInitAccountNameInput', true),
  withState('newAccount', 'setNewAccount', null),

  withStateHandlers(
    ({ initReslovedWallet = null }) => ({
      reslovedWallet: initReslovedWallet,
    }),
    {
      setReslovedWallet: () => val => ({ reslovedWallet: val }),
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
