import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import Route from 'renderer/components/Route';
import types from 'renderer/types';
import enTranslation from 'renderer/i18n/en.json';
import TosPage from 'renderer/pages/tosPage';
import ChooseNetworkPage from 'renderer/pages/chooseNetworkPage';
import SyncNodePage from 'renderer/pages/syncNodePage';
import DevPage from 'renderer/pages/devPage';
import WalletRoutes from 'renderer/routes/WalletRoutes';
import ProfileRoutes from 'renderer/routes/ProfileRoutes';
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
        <Route exact path={ROUTES.ROOT} render={() => <Redirect to={ROUTES.CHOOSE_NETWORK} />} />
        <Route path={ROUTES.WALLET.ROOT} render={WalletRoutes} />
        <Route path={ROUTES.PROFILE.ROOT} render={ProfileRoutes} />
        <Route exact path={ROUTES.TERMS_OF_USE_ACCEPTANCE} component={TosPage} />
        <Route exact path={ROUTES.CHOOSE_NETWORK} component={ChooseNetworkPage} />
        <Route exact path={ROUTES.SYNC_NODE} component={SyncNodePage} />
        <Route exact path="/dev" component={DevPage} />
      </Switch>
    );
  }
}

export default withLocalize(AppRoutes);
