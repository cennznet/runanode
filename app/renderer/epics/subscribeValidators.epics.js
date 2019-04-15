import { of } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { debounceTime, map, mergeMap } from 'rxjs/operators';

import appConfig from 'app/config';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';

const subscribeValidatorsEpic = (action$, state$) => {
  return action$.ofType(types.subscribeValidators.triggered).pipe(
    debounceTime(appConfig.app.apiInitDebounceTime),
    mergeMap(() => {
      return new Observable(async observer => {
        await window.appApi.api.query.session.validators(validators => {
          observer.next(validators);
        });
      }).pipe(
        mergeMap(validators => {
          const stakingStashAccountAddress =
            state$.value.localStorage[storageKeys.STAKING_STASH_ACCOUNT_ADDRESS];

          const isStaking =
            !!stakingStashAccountAddress &&
            validators &&
            validators.map(v => v.toString(10)).includes(stakingStashAccountAddress);

          // TODO: Handle coming back from accident

          if (isStaking) {
            return of(
              {
                type: types.notificationBar.triggered,
                payload: { type: 'STAKING_STARTED_NOTIFICATION' },
              },
              {
                type: types.setStorage.requested,
                payload: { key: storageKeys.STAKING_STATUS, value: 'STAKING' },
              }
            );
          }
          return of({
            type: types.notificationBar.triggered,
            payload: { type: '' },
          });
        })
      );
    })
  );
};

export default [subscribeValidatorsEpic];
