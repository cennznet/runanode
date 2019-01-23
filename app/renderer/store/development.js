import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { routerMiddleware } from 'connected-react-router';
import history from 'renderer/history';
import { createLogger } from 'redux-logger';
import gaMiddleware from './middlewares/analytics';

import config from 'renderer/utils/config';
import rootReducer from '../reducers';
import epics from '../epics';

// Redux Configuration
const middleware = [];

const epicMiddleware = createEpicMiddleware();
middleware.push(epicMiddleware);

// Skip redux logs in console during the tests
if (process.env.NODE_ENV !== 'test' && config.app.LOG_REDUX) {
  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });
  middleware.push(logger);
}

middleware.push(routerMiddleware(history));
middleware.push(gaMiddleware({ logger: true }));

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    : f => f
);

const store = createStore(rootReducer, composedEnhancers);

epicMiddleware.run(epics);

if (module.hot) {
  module.hot.accept(
    '../reducers',
    // eslint-disable-next-line global-require
    () => store.replaceReducer(require('../reducers').default)
  );
}

export default store;
