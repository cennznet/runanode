import { Observable } from 'rxjs/Observable';
import { debounceTime, map, mergeMap } from 'rxjs/operators';

import appConfig from 'app/config';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';
import chainEpics from './chainEpics';

const subscribeFinalisedHeadsEpic = action$ =>
  action$.ofType(types.subscribeFinalisedHeads.triggered).pipe(
    debounceTime(appConfig.app.apiInitDebounceTime), // wait for api init
    mergeMap(() => {
      return new Observable(observer => {
        window.odin.api.cennz.api.rpc.chain.subscribeFinalisedHeads(newHead => {
          // Logger.trace(`subscribeFinalisedHeadsEpic, got FinalisedHead.`);
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

export default [
  subscribeFinalisedHeadsEpic,
  getAllAccountsBalancesEpic,
  chainNewHeadWithBalancesEpics,
];
