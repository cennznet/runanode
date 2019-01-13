import objectPath from 'object-path';
import { mergeMap, tap, catchError, filter, map, take, startWith, withLatestFrom } from 'rxjs/operators';
import { of, interval, merge } from 'rxjs';
import { ofType } from 'redux-observable';

import types from 'renderer/types';
import stream from 'renderer/stream/stream';
import streamTypes from 'renderer/stream/types';

const epic = (action$, state$) =>
  action$.pipe(
    ofType(types.nodeWsChainSubscribeNewHead.requested),
    withLatestFrom(state$),
    mergeMap(([actionValue, state]) => {
        console.log('stream chainSubscribeNewHead mergeMap');
        console.log(actionValue);
        console.log(state);


        // const { depth: { limit }, market: { currentMarket: { name: market } } } = store.getState();
        stream.send(streamTypes.chainSubscribeNewHead, {});

        return action$.pipe(
          ofType(types.streamMessage.changed),
          filter(action => (action.payload.method === streamTypes.chainNewHead)),
          // take(1),
          map((action) => {
            console.log(action);
            const data = objectPath.get(action, 'payload.params.result', null);

            if (data) {
              return { type: types.nodeWsChainSubscribeNewHead.completed, payload: data };
            }
            return { type: types.nodeWsChainSubscribeNewHead.failed };
          }),
        );
      }
    ),
  );

export default epic;
