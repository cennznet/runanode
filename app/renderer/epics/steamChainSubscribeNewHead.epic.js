import R from 'ramda';
import {
  mergeMap,
  tap,
  catchError,
  filter,
  map,
  take,
  startWith,
  withLatestFrom,
} from 'rxjs/operators';
import { of, interval, merge } from 'rxjs';
import { ofType } from 'redux-observable';

import types from 'renderer/types';
import { localStream as stream } from 'renderer/stream/stream';
import streamTypes from 'renderer/stream/types';

const epic = (action$, state$) =>
  action$.pipe(
    ofType(types.nodeWsChainSubscribeNewHead.requested),
    withLatestFrom(state$),
    mergeMap(([actionValue, state]) => {
      // const { depth: { limit }, market: { currentMarket: { name: market } } } = store.getState();
      stream.send(streamTypes.chainSubscribeNewHead, {});

      return action$.pipe(
        ofType(types.streamMessage.changed),
        filter(action => action.payload.method === streamTypes.chainNewHead),
        map(({ payload }) => {
          const data = R.pathOr(null, ['params', 'result'], payload);

          if (data) {
            return { type: types.nodeWsChainSubscribeNewHead.completed, payload: data };
          }
          return { type: types.nodeWsChainSubscribeNewHead.failed };
        })
      );
    })
  );

export default epic;
