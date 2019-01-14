import React from 'react';
import { Switch } from 'react-router-dom';
import { SubNav } from 'components/layout';
import Route from 'renderer/components/Route';
import WalletCreatePage from 'renderer/pages/walletCreatePage';
import WalletImportPage from 'renderer/pages/walletImportPage';
import WalletRestorePage from 'renderer/pages/walletRestorePage';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';

const navItems = [
  { title: 'Create wallet', link: ROUTES.WALLET.CREATE },
  { title: 'Import wallet', link: ROUTES.WALLET.IMPORT },
  { title: 'Restore wallet', link: ROUTES.WALLET.RESTORE },
];

const WalletRoutes = () => (
  <Switch>
    <Route
      path={ROUTES.WALLET.CREATE}
      component={props => <WalletCreatePage subNav={<SubNav {...{ navItems }} />} {...props} />}
    />
    <Route
      path={ROUTES.WALLET.IMPORT}
      render={() => (
        <React.Fragment>
          <WalletImportPage subNav={<SubNav {...{ navItems }} />} />
        </React.Fragment>
      )}
    />
    <Route
      path={ROUTES.WALLET.RESTORE}
      component={props => <WalletRestorePage subNav={<SubNav {...{ navItems }} />} {...props} />}
    />
  </Switch>
);

export default WalletRoutes;
