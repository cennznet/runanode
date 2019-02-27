import { EMPTY, from, of } from 'rxjs';
import { mergeMap, mapTo, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { storageKeys, getStorage, setStorage, clearStorage } from 'renderer/api/utils/storage';
import { enableGoogleAnalytics, disableGoogleAnalytics } from 'renderer/analytics';
import { Logger } from 'renderer/utils/logging';
import chainEpics from './chainEpics';

const enableAnalyticsEpic = action$ =>
  action$.pipe(
    ofType(types.enableAnalytics.triggered),
    mergeMap(({ payload }) => {
      enableGoogleAnalytics();
      return of({
        type: types.infoToaster.triggered,
        payload: 'Google Analytics has been enabled',
      });
    })
  );

const disableAnalyticsEpic = action$ =>
  action$.pipe(
    ofType(types.disableAnalytics.triggered),
    mergeMap(({ payload }) => {
      disableGoogleAnalytics();
      return of({
        type: types.infoToaster.triggered,
        payload: 'Google Analytics has been disabled',
      });
    })
  );

const enableAnalyticsAfterPreferenceBeingStoredEpic = action$ =>
  action$.ofType(types.setStorage.completed).pipe(
    filter(({ payload }) => payload.key === storageKeys.ENABLE_ANALYTICS && payload.value === true),
    mapTo({ type: types.enableAnalytics.triggered })
  );

const disableAnalyticsAfterPreferenceBeingStoredEpic = action$ =>
  action$.ofType(types.setStorage.completed).pipe(
    filter(
      ({ payload }) => payload.key === storageKeys.ENABLE_ANALYTICS && payload.value === false
    ),
    mapTo({ type: types.disableAnalytics.triggered })
  );

export default [
  enableAnalyticsEpic,
  disableAnalyticsEpic,
  enableAnalyticsAfterPreferenceBeingStoredEpic,
  disableAnalyticsAfterPreferenceBeingStoredEpic,
];
