import { EMPTY, of, from } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { mergeMap, switchMap, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { ApiRx, ApiPromise } from '@polkadot/api';
import WsProvider from '@polkadot/rpc-provider/ws';
import types from 'renderer/types';
import chainEpics from './chainEpics';

const testPageEpic = action$ =>
  action$.pipe(
    ofType(types.testPage.triggered),
    mergeMap(() => {
      return EMPTY;
    })
  );

const getBestBlockWhenLaunchEpic = chainEpics(
  types.testPage.triggered,
  types.getBestBlock.requested
);

const provider = new WsProvider('wss://cennz-infra.centrality.me:9944');
const latestBlock = () =>
  new ApiPromise(provider).isReady.then(api => {
    api.rpc.chain.subscribeNewHead(header => {
      console.log(`new block #${header}`);
    });
  });

const getBestBlockEpic = action$ =>
  action$.pipe(
    ofType(types.getBestBlock.requested),
    tap(() => console.log('Tes'))
    // switchMap(() =>
    //   new ApiRx(provider).rpc.chain
    //   .subscribeNewHead()
    //   .subscribe()
    //   .pipe(
    //     mergeMap((response) => ({type: types.getBestBlock.completed})))
    //   )
  );
// new ApiPromise(provider).isReady.then(api => {
//   api.rpc.chain.subscribeNewHead(header => {
//     console.log(`new block #${header}`);
//   });
// });
//   new ApiRx(provider).rpc.chain
//   .subscribeNewHead()
//   .subscribe(
//     header => {console.log('From ApiRx')}
//   )
// );

export default [testPageEpic, getBestBlockWhenLaunchEpic, getBestBlockEpic];
