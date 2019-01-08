import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import TosPage from 'renderer/pages/tosPage';
import TestPage from 'renderer/pages/testPage';
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
        <Route exact path="/" render={() => <Redirect to="/wallet/create" />} />
        <Route path="/wallet" render={WalletRoutes} />
        <Route exact path="/tos" render={() => <TosPage />} />
        <Route exact path="/sync" component={TestPage} />
      </Switch>
    );
  }
}

export default withLocalize(AppRoutes);
