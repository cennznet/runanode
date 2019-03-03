import { of, interval, merge, EMPTY } from 'rxjs';
import { catchError, concat, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import R from 'ramda';
import types from 'renderer/types';
import config from 'app/config';
import rxIpc from 'renderer/stream/rxIpc';

const nodeStateSubject$ = rxIpc.nodeStateSubject.pipe(
  map(state => {
    console.log('rxIpc.nodeStateSubject', state);
    return {
      type: types.nodeStateChange.triggered,
      payload: state,
    };
  })
);

const nodeStateFromIpcChanelEpic = action$ =>
  action$.pipe(
    ofType(types.ipcNodeState.triggered),
    switchMap(({ payload }) => {
      if (payload.command === 'SUBSCRIBE') {
        rxIpc.subscribe();
        return nodeStateSubject$;
      }

      if (payload.command === 'UNSUBSCRIBE') {
        rxIpc.unsubscribe();
        return EMPTY;
      }
    })
  );

export default [nodeStateFromIpcChanelEpic];
