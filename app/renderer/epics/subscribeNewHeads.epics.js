import { Observable } from 'rxjs/Observable';
import { debounceTime, map, mergeMap } from 'rxjs/operators';

import appConfig from 'app/config';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';
import chainEpics from './chainEpics';

const subscribeNewHeadEpic = action$ =>
  action$.ofType(types.subscribeNewHead.triggered).pipe(
    debounceTime(appConfig.app.apiInitDebounceTime), // wait for api init
    mergeMap(() => {
      return new Observable(observer => {
        window.appApi.api.rpc.chain.subscribeNewHead(newHead => {
          // Logger.trace(`subscribeNewHeadEpic, got newHead.`);
          observer.next(newHead);
        });
      }).pipe(
        debounceTime(appConfig.app.defaultDebounceTime),
        map(newHead => {
          return { type: types.newHead.changed, payload: newHead };
        })
      );
    })
  );

const chainGetHeaderEpic = action$ =>
  action$.ofType(types.nodeWsChainGetHeader.requested).pipe(
    mergeMap(async () => {
      const header = await window.appApi.api.rpc.chain.getHeader();
      Logger.debug(`chainGetHeaderEpic, header: ${JSON.stringify(header)}`);
      if (header) {
        return { type: types.newHead.changed, payload: header };
      }
    })
  );

const getSystemChainEpic = (action$, state$) =>
  action$.ofType(types.nodeWsSystemChain.requested).pipe(
    mergeMap(async () => {
      // Logger.trace(`getSystemChainEpic, types.nodeWsSystemChain.requested`);
      const data = await window.appApi.api.rpc.system.chain();
      // Logger.trace(`getSystemChainEpic, data: ${data}`);
      if (!data) {
        return { type: types.nodeWsSystemChain.failed };
      }
      return { type: types.nodeWsSystemChain.completed, payload: data.toString() };
    })
  );

const chainGetSystemChainEpicEpics = chainEpics(
  types.newHead.changed,
  types.nodeWsSystemChain.requested
);

// For JSON RPC Calls
// const chainNodeJsonRpcSystemEpics = chainEpics(
//   types.newHead.changed,
//   types.nodeJsonRpcSystem.requested
// );

export default [
  subscribeNewHeadEpic,
  getSystemChainEpic,
  chainGetSystemChainEpicEpics,
  // chainNodeJsonRpcSystemEpics,
  chainGetHeaderEpic,
];
