import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import TosPage from 'renderer/pages/tosPage';
import ChooseNetworkPage from 'renderer/pages/chooseNetworkPage';
import SyncNodePage from 'renderer/pages/syncNodePage';
import WalletRoutes from 'renderer/routes/WalletRoutes';
import enTranslation from 'renderer/i18n/en.json';

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
        <Route exact path="/" render={() => <Redirect to="/syncNode" />} />
        <Route path="/wallet" render={WalletRoutes} />
        <Route exact path="/tos" render={() => <TosPage />} />
        <Route exact path="/chooseNetwork" render={() => <ChooseNetworkPage />} />
        <Route exact path="/syncNode" component={SyncNodePage} />
      </Switch>
    );
  }
}

export default withLocalize(AppRoutes);
