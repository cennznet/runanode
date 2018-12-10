import { combineReducers } from 'redux';
import { localizeReducer } from 'react-localize-redux';

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
  ...reducers,
});

export default rootReducer;
