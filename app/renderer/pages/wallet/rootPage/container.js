import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import history from 'renderer/history';
import ROUTES from 'renderer/constants/routes';

const mapStateToProps = ({ localStorage }) => ({ localStorage });

const mapDispatchToProps = dispatch => ({
  onPageLoaded: payload => {},
});

const enhance = compose(
  lifecycle({
    componentDidMount() {
      const storedWallets = this.props.localStorage[storageKeys.WALLETS];
      const hasWallet = storedWallets && storedWallets.length > 0;
      const nextRoute = hasWallet
        ? `${ROUTES.WALLET.DETAILS}/${storedWallets[0].id}`
        : ROUTES.WALLET.LANDING;

      history.push(nextRoute);
    },
  })
);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
