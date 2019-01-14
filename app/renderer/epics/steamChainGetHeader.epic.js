import objectPath from 'object-path';
import { mergeMap, tap, catchError, filter, map, take, startWith, withLatestFrom } from 'rxjs/operators';
import { of, interval, merge, EMPTY } from 'rxjs';
import { ofType } from 'redux-observable';

import types from 'renderer/types';
import streamTypes from 'renderer/stream/types';
import { getStream, getStreamMessageChangedType, getNodeWsChainGetHeaderType } from 'renderer/helpers/actionTypeHelper';

const epic = (action$, state$) =>
  action$.pipe(
    ofType(types.nodeWsChainGetHeader.requested, types.nodeWsRemoteChainGetHeader.requested),
    mergeMap((actionValue) => {
        console.log('stream nodeWsChainGetHeader mergeMap');
        console.log(actionValue);
        console.log(state$.value);

        // const { depth: { limit }, market: { currentMarket: { name: market } } } = store.getState();
        const id = getStream(actionValue).send(streamTypes.chainGetHeader, {});
        console.log('chainNewHead action id');
        console.log(id);

        if (!id) {
          return EMPTY;
        }
        return action$.pipe(
          ofType(getStreamMessageChangedType(actionValue).changed),
          filter(action => (action.payload.id === id)),
          // filter(action => (action.payload.method === streamTypes.chainNewHead)),
          // take(1),
          map((action) => {
            console.log('chainNewHead action respond');
            console.log(action);
            const data = objectPath.get(action, 'payload.result', null);

            if (data) {
              return { type: getNodeWsChainGetHeaderType(actionValue).completed, payload: data };
            }
            return { type: getNodeWsChainGetHeaderType(actionValue).failed };
          }),
        );
      },
    ),
  );

export default epic;
