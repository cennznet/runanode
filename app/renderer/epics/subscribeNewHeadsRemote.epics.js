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
        window[APP_BRAND].api.cennz.apiRemote.rpc.chain.subscribeNewHead(newHead => {
          // Logger.trace(`subscribeNewHeadRemoteEpic, got newHead.`);
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
  action$.ofType(types.nodeWsSystemChainRemote.requested).pipe(
    mergeMap(async () => {
      // Logger.trace(`getSystemChainEpic, types.nodeWsSystemChain.requested`);
      const data = await window[APP_BRAND].api.cennz.apiRemote.rpc.system.chain();
      // Logger.trace(`getSystemChainEpic, data: ${data}`);
      if (!data) {
        return { type: types.nodeWsSystemChainRemote.failed };
      }
      return { type: types.nodeWsSystemChainRemote.completed, payload: data.toString() };
    }),
  );

const chainGetSystemChainEpicEpics = chainEpics(
  types.newHeadRemote.changed,
  types.nodeWsSystemChainRemote.requested
);


export default [
  subscribeNewHeadRemoteEpic,
  getSystemChainEpic,
  chainGetSystemChainEpicEpics,
];
