import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import R from 'ramda';
import isEqual from 'react-fast-compare';

import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import history from 'renderer/history';
import ROUTES from 'renderer/constants/routes';


const mapStateToProps = ({ localStorage }) => ({ wallets: localStorage[storageKeys.WALLETS] });

const mapDispatchToProps = dispatch => ({
  onPageLoaded: payload => {},
  onSyncWalletData: payload => {
    console.log('onSyncWalletData');
    dispatch({ type: types.syncWalletData.requested, payload });
  },
});

const enhance = compose(
  lifecycle({
    componentDidMount() {
      console.log('componentDidMount');
      console.log(this.props);
      const { onSyncWalletData, match, wallets } = this.props;
      const { walletId, accountPublicAddress } = match.params;
      const wallet = R.find(R.propEq('id', walletId))(wallets);
      onSyncWalletData({ id: walletId, wallet });
    },

    // shouldComponentUpdate(nextProps, nextState) {
    //   console.log('shouldComponentUpdate');
    //   // console.log(`nextProps: ${nextProps}`);
    //   // console.log(nextProps);
    //   // console.log(`this.props: ${this.props}`);
    //   // console.log(this.props);
    //
    //   console.log(isEqual(this.props.wallets,nextProps.wallets));
    //   console.log(this.props.wallets === nextProps.wallets);
    //   console.log(this.props.wallets);
    //   console.log(nextProps.wallets);
    //   // if(nextProps && nextProps.match) {
    //   //   const nextMatchWalletId = nextProps.match.params.walletId;
    //   //   const wallet = R.find(R.propEq('id', walletId))(wallets);
    //   //   const account = wallet.accounts[accountPublicAddress];
    //   //   console.log(`walletId: ${walletId}`);
    //   //   console.log(`nextMatchWalletId: ${nextMatchWalletId}`);
    //   //   if (walletId !== nextMatchWalletId) {
    //   //     onSyncWalletData({ wallet });
    //   //     return true
    //   //   } else {
    //   //     return false;
    //   //   }
    //   // }
    //   return !isEqual(this.props.wallets,nextProps.wallets);
    //
    // }
  })
);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
