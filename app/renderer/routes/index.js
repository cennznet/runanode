import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import TestPage from '../pages/testPage';
import enTranslation from '../i18n/en.json';

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
        <Route exact path="/" render={() => <Redirect to="/test" />} />
        <Route exact path="/test" component={TestPage} />
      </Switch>
    );
  }
}

export default withLocalize(AppRoutes);
