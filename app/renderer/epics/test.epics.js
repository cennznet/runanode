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

export default [testPageEpic];
