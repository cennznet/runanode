// import 'reset-css';
import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ja from 'react-intl/locale-data/ja';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faCogs, faQuestionCircle, faWallet } from '@fortawesome/free-solid-svg-icons';
import App from './App';
import './scss/styles.scss';
import { setupApi } from './api/index';
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

library.add(faPlus, faCogs, faQuestionCircle, faWallet);

const initializeOdin = () => {
  const api = setupApi(isTest, String(NETWORK));
  // const router = new RouterStore();
  // const history = syncHistoryWithStore(hashHistory, router);
  // const stores = setupStores(api, actions, router);

  window.odin = {
    api,
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

  console.log('render app');

  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('No #root element found.');
  // render(<App stores={stores} actions={actions} history={history} />, rootElement);
  render(<App />, rootElement);

  // render(<App />, document.getElementById('root'));
};

window.addEventListener('load', initializeOdin);
window.addEventListener('dragover', event => event.preventDefault());
window.addEventListener('drop', event => event.preventDefault());
console.log('render index');
