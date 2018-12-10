import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from 'renderer/reducers';
import epics from 'renderer/epics';

const epicMiddleware = createEpicMiddleware();
const composedEnhancers = compose(applyMiddleware(epicMiddleware));
const store = createStore(rootReducer, composedEnhancers);

epicMiddleware.run(epics);

export default store;
