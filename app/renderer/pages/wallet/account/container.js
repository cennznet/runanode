import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import R from 'ramda';


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
  }
});

const enhance = compose(
  lifecycle({
    componentDidMount() {
      Logger.debug('componentDidMount');
      Logger.debug(this.props);

      // sync wallet data on page load
      const { onSyncWalletData, match, wallets } = this.props;
      const { walletId, accountPublicAddress } = match.params;
      const wallet = R.find(R.propEq('id', walletId))(wallets);
      onSyncWalletData({ id: walletId, wallet });
    },

    componentDidUpdate(prevProps) {

      // sync wallet data when nav to different account
      if (this.props.match.params.walletId !== prevProps.match.params.walletId) {
        Logger.debug('sync wallet data on different wallet Id');
        const { onSyncWalletData, match, wallets } = this.props;
        const { walletId, accountPublicAddress } = match.params;
        const wallet = R.find(R.propEq('id', walletId))(wallets);
        onSyncWalletData({ id: walletId, wallet });
      }
    }
  })
);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
