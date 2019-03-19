import { Observable } from 'rxjs/Observable';
import { debounceTime, map, mergeMap } from 'rxjs/operators';
import types from 'renderer/types';
import { storageKeys } from 'renderer/api/utils/storage';
import chainEpics from './chainEpics';

const subscribeFinalisedHeadsEpic = action$ =>
  action$.ofType(types.subscribeFinalisedHeads.triggered).pipe(
    debounceTime(6000),
    mergeMap(() => {
      return new Observable(observer => {
        window.odin.api.cennz.api.rpc.chain.subscribeFinalisedHeads(newHead => {
          observer.next(newHead);
        });
      }).pipe(
        debounceTime(500),
        map(newHead => {
          return { type: types.finalisedHeader.changed, payload: newHead };
        })
      );
    })
  );

const getAllAccoutsBalancesEpic = (action$, state$) =>
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
  types.finalisedHeader.changed,
  types.getAllAccountsBalances.requested
);

export default [
  subscribeFinalisedHeadsEpic,
  getAllAccoutsBalancesEpic,
  chainNewHeadWithBalancesEpics,
];
