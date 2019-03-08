import { Observable } from 'rxjs/Observable';
import { debounceTime, map, mergeMap } from 'rxjs/operators';
import types from 'renderer/types';
import { storageKeys } from '../api/utils/storage';

const validatorEpic = (action$, state$) => {
  return action$.ofType(types.subscribeValidators.triggered).pipe(
    debounceTime(6000),
    mergeMap(() => {
      return new Observable(async observer => {
        await window.odin.api.cennz.api.query.session.validators(validators => {
          observer.next(validators);
        });
      }).pipe(
        map(validators => {
          const stakingStashAccountAddress =
            state$.value.localStorage[storageKeys.STAKING_STASH_ACCOUNT_ADDRESS];

          const isStaking =
            !!stakingStashAccountAddress &&
            validators &&
            validators.map(v => v.toString(10)).includes(stakingStashAccountAddress);

          if (isStaking) {
            return {
              type: types.notificationBar.triggered,
              payload: { type: 'STAKING_STARTED_NOTIFICATION' },
            };
          }
          return {
            type: types.notificationBar.triggered,
            payload: { type: '' },
          };
        })
      );
    })
  );
};

export default [validatorEpic];
