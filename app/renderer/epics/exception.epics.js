import { EMPTY, from, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  map,
  mapTo,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';
import ROUTES from '../constants/routes';

const wsConnectionErrorEpic = action$ => {
  return action$
    .ofType(types.wsLocalStatusChange.triggered, types.wsRemoteStatusChange.triggered)
    .pipe(
      withLatestFrom(action$.ofType(types.nodeStateChange.triggered)),
      filter(
        ([{ payload }, nodeStateChangeAction]) =>
          payload.type === 'error' && nodeStateChangeAction.payload === 'running'
      ),
      mapTo({
        type: types.navigation.triggered,
        payload: ROUTES.ERROR,
      })
    );
};

const wsConnectionReadyEpic = action$ => {
  return action$
    .ofType(types.wsLocalStatusChange.triggered, types.wsRemoteStatusChange.triggered)
    .pipe(
      filter(
        ({ payload }) =>
          (payload.type === 'ready' || payload.type === 'connected') && // ws reconnection wont fire `ready` event again
          window.location.href.endsWith('/error') // file:/app/app.html#/error
      ),
      mapTo({
        type: types.navigation.triggered,
        payload: ROUTES.WALLET.ROOT,
      })
    );
};

const errorPageEpic = action$ => {
  return action$.ofType(types.errorPage.triggered).pipe(
    mapTo({
      type: types.navigation.triggered,
      payload: ROUTES.ERROR,
    })
  );
};

export default [errorPageEpic, wsConnectionReadyEpic, wsConnectionErrorEpic];
