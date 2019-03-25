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
        window.odin.api.cennz.api.rpc.chain.subscribeNewHead(newHead => {
          Logger.debug(`subscribeNewHeadEpic, got newHead.`);
          observer.next(newHead);
        });
      }).pipe(
        debounceTime(appConfig.app.defaultDebounceTime),
        map(newHead => {
          Logger.debug(`subscribeNewHeadEpic, types.NewHeader.changed.`);
          return { type: types.newHead.changed, payload: newHead };
        })
      );
    })
  );

const getAllAccountsBalancesEpic = (action$, state$) =>
  action$.ofType(types.getAllAccountsBalances.requested).pipe(
    mergeMap(async () => {
      const wallets = state$.value.localStorage[storageKeys.WALLETS] || [];

      const allWalletBalances = await Promise.all(
        wallets.map(async wallet => {
          const walletBalances = await window.odin.api.cennz.getBalancesByWallet(wallet);
          return walletBalances;
        })
      );

      const allAccountBalances = allWalletBalances.reduce(
        (acc, curr) => Object.assign(curr, acc),
        {}
      );

      return {
        type: types.getAllAccountsBalances.completed,
        payload: allAccountBalances,
      };
    })
  );

const chainNewHeadWithBalancesEpics = chainEpics(
  types.newHead.changed,
  types.getAllAccountsBalances.requested
);

const getSystemChainEpic = (action$, state$) =>
  action$.ofType(types.nodeWsSystemChain.requested).pipe(
    mergeMap(async () => {
      Logger.debug(`getSystemChainEpic, types.nodeWsSystemChain.requested`);
      const data = await window.odin.api.cennz.api.rpc.system.chain();
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


// For JSON RPC Calls
// const chainNodeJsonRpcSystemEpics = chainEpics(
//   types.newHead.changed,
//   types.nodeJsonRpcSystem.requested
// );

export default [
  subscribeNewHeadEpic,
  getAllAccountsBalancesEpic,
  chainNewHeadWithBalancesEpics,
  // chainNodeJsonRpcSystemEpics,
  getSystemChainEpic,
  chainGetSystemChainEpicEpics,
];
