import { Observable } from 'rxjs/Observable';
import { EMPTY, from, of } from 'rxjs';
import { catchError, debounceTime, map, mergeMap } from 'rxjs/operators';

import appConfig from 'app/config';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';
import ROUTES from '../constants/routes';

const exceptionEpic = (action$, state$) => {
  return action$.ofType(types.init.triggered).pipe(
    debounceTime(appConfig.app.apiInitDebounceTime-1000),
    mergeMap(() => {
      if(!window.odin) {
        Logger.debug(`exceptionEpic fail to init API`);
        window.odin = {
          api: {
            cennz: {
              api: {
                rpc: {
                  chain : {
                    subscribeNewHead: () => {},
                    subscribeFinalisedHeads: () => {},
                  }
                },
                query: {
                  session: {
                    validators: () => {},
                  }
                }
              },
              apiRemote: {
                rpc: {
                  chain : {
                    subscribeNewHead: () => {},
                    subscribeFinalisedHeads: () => {},
                  }
                },
                query: {
                  session: {
                    validators: () => {},
                  }
                }
              },
            }
          }
        };
        return of({
          type: types.navigation.triggered,
          payload: ROUTES.DEV,
        });
      }
      // return new Observable(async observer => {
      //   await window.odin.api.cennz.api.query.session.validators(validators => {
      //     observer.next(validators);
      //   });
      // }).pipe(
      //   map(validators => {
      //     const stakingStashAccountAddress =
      //       state$.value.localStorage[storageKeys.STAKING_STASH_ACCOUNT_ADDRESS];
      //
      //     const isStaking =
      //       !!stakingStashAccountAddress &&
      //       validators &&
      //       validators.map(v => v.toString(10)).includes(stakingStashAccountAddress);
      //
      //     if (isStaking) {
      //       return {
      //         type: types.notificationBar.triggered,
      //         payload: { type: 'STAKING_STARTED_NOTIFICATION' },
      //       };
      //     }
      //     return {
      //       type: types.notificationBar.triggered,
      //       payload: { type: '' },
      //     };
      //   })
      // );
    }),
    catchError( err => {
      Logger.debug(`exceptionEpic failed`);
      Logger.debug(err);
    })
  );
};

export default [exceptionEpic];
