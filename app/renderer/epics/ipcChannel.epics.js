import { create, of, interval, merge, EMPTY } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { catchError, concat, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import R from 'ramda';
import types from 'renderer/types';
import { cennznetStateChangeChannel, cennznetStatusChannel } from 'renderer/ipc/cennznet.ipc';

const nodeStateSubscriptionEpic = () =>
  Observable.create(obs => {
    cennznetStateChangeChannel.onReceive(state => {
      obs.next(state);
    });
  }).pipe(
    map(state => {
      return {
        type: types.nodeStateChange.triggered,
        payload: state,
      };
    })
  );

export default [nodeStateSubscriptionEpic];
