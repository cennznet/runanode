import { Observable } from 'rxjs/Observable';
import { debounceTime, map, mergeMap } from 'rxjs/operators';

import appConfig from 'app/config';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';
import chainEpics from './chainEpics';

const subscribeNewHeadsEpic = action$ =>
  action$.ofType(types.subscribeNewHeads.triggered).pipe(
    debounceTime(appConfig.app.apiInitDelay), // wait for api init
    mergeMap(() => {
      return new Observable(observer => {
        window.odin.api.cennz.api.rpc.chain.subscribeNewHead(newHead => {
          Logger.debug(`subscribeNewHeadsEpic, got newHead.`);
          observer.next(newHead);
        });
      }).pipe(
        debounceTime(500),
        map(newHead => {
          Logger.debug(`subscribeNewHeadsEpic, types.NewHeader.changed.`);
          return { type: types.newHeader.changed, payload: newHead };
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
  types.newHeader.changed,
  types.getAllAccountsBalances.requested
);

export default [
  subscribeNewHeadsEpic,
  getAllAccountsBalancesEpic,
  chainNewHeadWithBalancesEpics,
];
