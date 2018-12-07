import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import rootReducer from '@/reducers';
import epics from '@/epics';

const epicMiddleware = createEpicMiddleware();

const composedEnhancers = compose(
  applyMiddleware(epicMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
);

const store = createStore(rootReducer, composedEnhancers);

epicMiddleware.run(epics);

export default store;
