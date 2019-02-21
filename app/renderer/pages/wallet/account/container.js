import { connect } from 'react-redux';
import { compose, lifecycle, withState, withStateHandlers } from 'recompose';
import { lensProp, set, find, propEq } from 'ramda';

import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import history from 'renderer/history';
import ROUTES from 'renderer/constants/routes';
import { Logger } from 'renderer/utils/logging';

const mapStateToProps = ({ localStorage, transaction }) => ({
  wallets: localStorage[storageKeys.WALLETS],
  transaction,
});

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

  onConfirmAddAccount: payload => {
    dispatch({ type: types.addAccount.requested, payload });
  },
});

const enhance = compose(
  lifecycle({
    componentDidMount() {
      Logger.debug('onAddAccount - componentDidMount');
      Logger.debug(this.props);
      // sync wallet data on page load
      const { onSyncWalletData, match, wallets } = this.props;
      const { walletId, accountPublicAddress } = match.params;
      const wallet = find(propEq('id', walletId))(wallets);
      onSyncWalletData({ id: walletId, wallet });
    },
    componentDidUpdate(prevProps) {
      Logger.debug('onAddAccount - componentDidUpdate');
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
