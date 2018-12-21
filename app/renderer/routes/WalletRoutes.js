import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { SubNav } from 'components/layout';
import WalletCreatePage from 'renderer/pages/walletCreatePage';
import WalletImportPage from 'renderer/pages/walletImportPage';
import WalletRestorePage from 'renderer/pages/walletRestorePage';

const navItems = [
  { title: 'Create wallet', link: '/wallet/create' },
  { title: 'Import wallet', link: '/wallet/import' },
  { title: 'Restore wallet', link: '/wallet/restore' },
];

const WalletRoutes = () => (
  <Switch>
    <Route
      path="/wallet/create"
      render={() => (
        <React.Fragment>
          <WalletCreatePage subNav={<SubNav {...{ navItems }} />} />
        </React.Fragment>
      )}
    />
    <Route
      path="/wallet/import"
      render={() => (
        <React.Fragment>
          <WalletImportPage subNav={<SubNav {...{ navItems }} />} />
        </React.Fragment>
      )}
    />
    <Route
      path="/wallet/restore"
      render={() => (
        <React.Fragment>
          <WalletRestorePage subNav={<SubNav {...{ navItems }} />} />
        </React.Fragment>
      )}
    />
  </Switch>
);

export default WalletRoutes;
