import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { localizeReducer } from 'react-localize-redux';
import history from 'renderer/history';

const reducersContext = require.context('./', true, /\.reducer\.js$/);

const reducers = {};
const reducerRegex = /\.\/(.*?)\./;

reducersContext.keys().forEach(key => {
  const reducerKey = key.match(reducerRegex)[1];
  if (reducerKey != null) {
    reducers[reducerKey] = reducersContext(key).default;
  }
});

const rootReducer = combineReducers({
  localize: localizeReducer,
  router: connectRouter(history),
  ...reducers,
});

export default rootReducer;
