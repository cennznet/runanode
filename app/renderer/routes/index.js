import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import types from 'renderer/types';
import enTranslation from 'renderer/i18n/en.json';
import TosPage from 'renderer/pages/tosPage';
import ChooseNetworkPage from 'renderer/pages/chooseNetworkPage';
import SyncNodePage from 'renderer/pages/syncNodePage';
import DevPage from 'renderer/pages/devPage';
import HomePage from 'renderer/pages/homePage';
import WaitPage from 'renderer/pages/waitPage';
import WalletLandingPage from 'renderer/pages/wallet/landingPage';
import WalletAccountPage from 'renderer/pages/wallet/account';
import WalletCreatePage from 'renderer/pages/wallet/create';
import WalletConnectPage from 'renderer/pages/wallet/connect';
import WalletRootPage from 'renderer/pages/wallet/rootPage';
import StakingRoutes from 'renderer/routes/StakingRoutes';
import SettingsRoutes from 'renderer/routes/SettingsRoutes';
import ROUTES from 'renderer/constants/routes';
import Route from './Route';
import withContainer from './container';

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
    const { isStakingStated } = this.props;
    return (
      <Switch>
        <Route exact path={ROUTES.ROOT} component={HomePage} />
        <Route exact path={ROUTES.WAIT} component={WaitPage} />
        <Redirect exact from={ROUTES.STAKING.ROOT} to={ROUTES.STAKING.OVERVIEW} />
        <Redirect exact from={ROUTES.SETTINGS.ROOT} to={ROUTES.SETTINGS.GENERAL} />
        <Route exact from={ROUTES.WALLET.ROOT} component={WalletRootPage} />
        <Route
          path={`${ROUTES.WALLET.ROOT}/:walletId/accounts/:accountPublicAddress`}
          component={WalletAccountPage}
        />
        <Route exact path={ROUTES.WALLET.LANDING} component={WalletLandingPage} />
        <Route exact path={ROUTES.WALLET.CREATE} component={WalletCreatePage} />
        <Route exact path={ROUTES.WALLET.CONNECT} component={WalletConnectPage} />
        <Route path={ROUTES.STAKING.ROOT} render={() => <StakingRoutes {...{ isStakingStated }} />}  />
        <Route path={ROUTES.SETTINGS.ROOT} render={SettingsRoutes} />
        <Route exact path={ROUTES.TERMS_OF_USE_ACCEPTANCE} component={TosPage} />
        <Route exact path={ROUTES.CHOOSE_NETWORK} render={() => <ChooseNetworkPage />} />
        <Route exact path={ROUTES.SYNC_NODE} component={SyncNodePage} />
        <Route exact path={ROUTES.DEV} component={DevPage} />
      </Switch>
    );
  }
}

export default withLocalize(withContainer(AppRoutes));
