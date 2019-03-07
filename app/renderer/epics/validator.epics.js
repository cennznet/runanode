import { of, timer } from 'rxjs';
import R from 'ramda';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import { storageKeys } from '../api/utils/storage';

const validatorEpic = (action$, state$) => {
  const stream$ = timer(4000).pipe(
    mergeMap(() => {
      return Observable.create(async observer => {
        await window.odin.api.cennz.api.query.session.validators(validators => {
          observer.next(validators);
        });
      }).pipe(
        map(validators => {
          const stakingStashAccountAddress =
            state$.value.localStorage[storageKeys.STAKING_STASH_ACCOUNT_ADDRESS];
          console.log('stakingStashAccountAddress', stakingStashAccountAddress);

          validators.map(v => console.log(v.toString(10)));

          const isStaking =
            !!stakingStashAccountAddress &&
            validators &&
            validators.map(v => v.toString(10)).includes(stakingStashAccountAddress);
          console.log('isStaking', isStaking);

          if (isStaking) {
            return {
              type: types.notificationBar.triggered,
              payload: { type: 'STAKING_NOTIFICATION' },
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

  console.log('stream$', stream$);
  return stream$;
};

export default [validatorEpic];
