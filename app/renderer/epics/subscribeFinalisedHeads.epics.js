import { Observable } from 'rxjs/Observable';
import { debounceTime, map, mergeMap } from 'rxjs/operators';

import appConfig from 'app/config';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';

const subscribeFinalisedHeadsEpic = action$ =>
  action$.ofType(types.subscribeFinalisedHeads.triggered).pipe(
    debounceTime(appConfig.app.apiInitDebounceTime), // wait for api init
    mergeMap(() => {
      return new Observable(observer => {
        window.odin.api.cennz.api.rpc.chain.subscribeFinalisedHeads(newHead => {
          Logger.debug(`subscribeFinalisedHeadsEpic, got FinalisedHead.`);
          observer.next(newHead);
        });
      }).pipe(
        debounceTime(appConfig.app.defaultDebounceTime),
        map(newHead => {
          Logger.debug(`subscribeFinalisedHeadsEpic, types.finalisedHeader.changed.`);
          return { type: types.finalisedHeader.changed, payload: newHead };
        })
      );
    })
  );

export default [
  subscribeFinalisedHeadsEpic,
];
