import React from 'react';
import { Switch } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';
import { SubNav } from 'components/layout';
import Route from 'renderer/components/Route';
import WalletDetailsPage from 'renderer/pages/wallet/detailsPage';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';

const enhance = compose(
  lifecycle({
    componentDidMount() {
      console.log('!!!!!!');
    },
  })
);

const navItems = [
  { title: 'General', link: `${ROUTES.WALLET.DETAILS}/1` },
  { title: 'Terms and Conditions', link: `${ROUTES.WALLET.DETAILS}/2` },
];

const WalletDetailsRoutes = () => {
  console.log('%%%%%%%', `${ROUTES.WALLET.DETAILS}/1`);
  return (
    <Switch>
      <Route
        path={`${ROUTES.WALLET.DETAILS}/1`}
        component={props => <WalletDetailsPage subNav={<SubNav {...{ navItems }} />} {...props} />}
      />
      <Route
        path={`${ROUTES.WALLET.DETAILS}/2`}
        component={props => <WalletDetailsPage subNav={<SubNav {...{ navItems }} />} {...props} />}
      />
    </Switch>
  );
};

export default WalletDetailsRoutes;
