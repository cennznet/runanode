import { combineEpics } from 'redux-observable';

const epicsContext = require.context('./', true, /\.epic\.js$/);
const multipleEpicsContext = require.context('./', true, /\.epics\.js$/);

const epics = [];

epicsContext.keys().forEach(key => {
  epics.push(epicsContext(key).default);
});

multipleEpicsContext.keys().forEach(key => {
  epics.push(...multipleEpicsContext(key).default);
});

const rootEpic = combineEpics(...epics);

export default rootEpic;
