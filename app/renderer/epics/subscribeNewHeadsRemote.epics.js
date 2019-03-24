import { Observable } from 'rxjs/Observable';
import { debounceTime, map, mergeMap } from 'rxjs/operators';

import appConfig from 'app/config';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';

const subscribeNewHeadsRemoteEpic = action$ =>
  action$.ofType(types.subscribeNewHeadsRemote.triggered).pipe(
    debounceTime(appConfig.app.apiInitDelay), // wait for api init
    mergeMap(() => {
      return new Observable(observer => {
        window.odin.api.cennz.apiRemote.rpc.chain.subscribeNewHead(newHead => {
          Logger.debug(`subscribeNewHeadsRemoteEpic, got newHead.`);
          observer.next(newHead);
        });
      }).pipe(
        debounceTime(500),
        map(newHead => {
          Logger.debug(`subscribeNewHeadsRemoteEpic, types.NewHeader.changed.`);
          return { type: types.newHeaderRemote.changed, payload: newHead };
        })
      );
    })
  );

export default [
  subscribeNewHeadsRemoteEpic,
];
