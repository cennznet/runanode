import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { routerMiddleware } from 'connected-react-router';
import history from 'renderer/history';
import rootReducer from '../reducers';
import epics from '../epics';

const epicMiddleware = createEpicMiddleware();
const composedEnhancers = compose(applyMiddleware(epicMiddleware, routerMiddleware(history)));
const store = createStore(rootReducer, composedEnhancers);

epicMiddleware.run(epics);

export default store;
