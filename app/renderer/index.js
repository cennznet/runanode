// import 'reset-css';
import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ja from 'react-intl/locale-data/ja';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft,
  faPlus,
  faCogs,
  faQuestionCircle,
  faWallet,
  faDownload,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faDev } from '@fortawesome/free-brands-svg-icons';
import { AppContainer } from 'react-hot-loader';
import 'electron-cookies'; // For GA writes clientId to cookie to recognize existing users
import setupGoogleAnalytics from './ga';
import types from './types';
import store from './store';
import App from './App';
import './scss/styles.scss';
import { setupApi } from './api/index';

// store.dispatch({ type: types.resetLocalStorage.triggered });
store.dispatch({ type: types.init.triggered });

// import utils from './utils';
// import translations from './i18n/translations';

// render(<App />, document.getElementById('root'));

// https://github.com/yahoo/react-intl/wiki#loading-locale-data
addLocaleData([...en, ...ja]);

// const { environment } = global;
// const environment = global.environment;
// const { NODE_ENV, NETWORK } = environment;
// const isTest = NODE_ENV === 'test';

const NETWORK = 'testnet';
const isTest = false;

library.add(
  faArrowLeft,
  faPlus,
  faCogs,
  faQuestionCircle,
  faWallet,
  faDownload,
  faDev,
  faExclamationCircle
);

const initializeOdin = () => {
  const api = setupApi();
  // const router = new RouterStore();
  // const history = syncHistoryWithStore(hashHistory, router);
  // const stores = setupStores(api, actions, router);
  setupGoogleAnalytics();

  window.odin = {
    api,
    store,
    // environment,
    // actions,
    // utils,
    // stores,
    // translations,
    // reset: action(() => {
    //   Action.resetAllActions();
    //   setupStores(api, actions, router);
    // }),
  };

  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('No #root element found.');
  render(
    <AppContainer>
      <App />
    </AppContainer>,
    rootElement
  );
};

window.addEventListener('load', initializeOdin);
window.addEventListener('dragover', event => event.preventDefault());
window.addEventListener('drop', event => event.preventDefault());

if (module.hot) {
  module.hot.accept('./App', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./App').default;
    render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
