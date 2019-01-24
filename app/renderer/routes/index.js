import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import types from 'renderer/types';
import enTranslation from 'renderer/i18n/en.json';
import TosPage from 'renderer/pages/tosPage';
import ChooseNetworkPage from 'renderer/pages/chooseNetworkPage';
import SyncNodePage from 'renderer/pages/syncNodePage';
import DevPage from 'renderer/pages/devPage';
import HomePage from 'renderer/pages/homePage';
import WalletLandingPage from 'renderer/pages/wallet/landingPage';
import WalletDetailsPage from 'renderer/pages/wallet/detailsPage';
import WalletCreatePage from 'renderer/pages/wallet/create';
import WalletConnectPage from 'renderer/pages/wallet/connect';
import WalletRootPage from 'renderer/pages/wallet/rootPage';
import SettingsRoutes from 'renderer/routes/SettingsRoutes';
import ROUTES from 'renderer/constants/routes';

const setupLocalize = props => {
  props.initialize({
    languages: [{ name: 'English', code: 'en' }],
    options: {
      renderToStaticMarkup,
      onMissingTranslation: ({ translationId }) => translationId,
    },
  });
  props.addTranslationForLanguage(enTranslation, 'en');
};

class AppRoutes extends React.Component {
  constructor(props) {
    super(props);
    setupLocalize(this.props);
  }

  render() {
    return (
      <Switch>
        <Route exact path={ROUTES.ROOT} component={HomePage} />
        <Redirect exact from={ROUTES.SETTINGS.ROOT} to={ROUTES.SETTINGS.GENERAL} />
        <Route exact from={ROUTES.WALLET.ROOT} component={WalletRootPage} />
        <Route path={`${ROUTES.WALLET.DETAILS}/:id`} component={WalletDetailsPage} />
        <Route exact path={ROUTES.WALLET.LANDING} component={WalletLandingPage} />
        <Route exact path={ROUTES.WALLET.CREATE} component={WalletCreatePage} />
        <Route exact path={ROUTES.WALLET.CONNECT} component={WalletConnectPage} />
        <Route path={ROUTES.SETTINGS.ROOT} render={SettingsRoutes} />
        <Route exact path={ROUTES.TERMS_OF_USE_ACCEPTANCE} component={TosPage} />
        <Route exact path={ROUTES.CHOOSE_NETWORK} render={() => <ChooseNetworkPage />} />
        <Route exact path={ROUTES.SYNC_NODE} component={SyncNodePage} />
        <Route exact path={ROUTES.DEV} component={DevPage} />
      </Switch>
    );
  }
}

export default withLocalize(AppRoutes);
