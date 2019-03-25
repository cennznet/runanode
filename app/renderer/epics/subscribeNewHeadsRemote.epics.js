import { Observable } from 'rxjs/Observable';
import { debounceTime, map, mergeMap } from 'rxjs/operators';

import appConfig from 'app/config';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';
import chainEpics from './chainEpics';

const subscribeNewHeadRemoteEpic = action$ =>
  action$.ofType(types.subscribeNewHeadRemote.triggered).pipe(
    debounceTime(appConfig.app.apiInitDebounceTime), // wait for api init
    mergeMap(() => {
      return new Observable(observer => {
        window.odin.api.cennz.apiRemote.rpc.chain.subscribeNewHead(newHead => {
          Logger.debug(`subscribeNewHeadRemoteEpic, got newHead.`);
          observer.next(newHead);
        });
      }).pipe(
        debounceTime(appConfig.app.defaultDebounceTime),
        map(newHead => {
          Logger.debug(`subscribeNewHeadRemoteEpic, types.NewHeader.changed.`);
          return { type: types.newHeadRemote.changed, payload: newHead };
        })
      );
    })
  );

const getSystemChainEpic = (action$, state$) =>
  action$.ofType(types.nodeWsSystemChain.requested).pipe(
    mergeMap(async () => {
      Logger.debug(`getSystemChainEpic, types.nodeWsSystemChain.requested`);
      const data = await window.odin.api.cennz.apiRemote.rpc.system.chain();
      Logger.debug(`getSystemChainEpic, data: ${data}`);
      if (!data) {
        return { type: types.nodeWsSystemChain.failed };
      }
      return { type: types.nodeWsSystemChain.completed, payload: data };
    }),
  );
const chainGetSystemChainEpicEpics = chainEpics(
  types.newHead.changed,
  types.nodeWsSystemChain.requested
);


export default [
  subscribeNewHeadRemoteEpic,
];
