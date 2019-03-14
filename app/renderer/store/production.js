import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { routerMiddleware } from 'connected-react-router';
import history from 'renderer/history';
import gaMiddleware from './middlewares/analytics';
import rootReducer from '../reducers';
import epics from '../epics';

const epicMiddleware = createEpicMiddleware();
const composedEnhancers = compose(
  applyMiddleware(epicMiddleware, routerMiddleware(history), gaMiddleware({ logger: false }))
);

const store = createStore(rootReducer, composedEnhancers);

epicMiddleware.run(epics);

export default store;
