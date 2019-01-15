import objectPath from 'object-path';
import { mergeMap, tap, catchError, filter, map, take, startWith, withLatestFrom } from 'rxjs/operators';
import { of, interval, merge, EMPTY } from 'rxjs';
import { ofType } from 'redux-observable';

import types from 'renderer/types';
import streamTypes from 'renderer/stream/types';
import { getStream, getStreamMessageChangedType, getNodeWsChainGetHeaderType } from 'renderer/helpers/actionTypeHelper';
import config from '../utils/config';

const epic = (action$, state$) =>
  action$.pipe(
    ofType(types.nodeWsSystemChain.requested),
    mergeMap((actionValue) => {
        const id = getStream(actionValue).send(streamTypes.systemChain, {});
        if (!id) {
          return EMPTY;
        }
        return action$.pipe(
          ofType(getStreamMessageChangedType(actionValue).changed),
          filter(action => (action.payload.id === id)),
          map((action) => {
            console.log('nodeWsSystemChain message changed');
            const data = objectPath.get(action, 'payload', null);
            if (data) {
              return { type: types.nodeWsSystemChain.completed, payload: data };
            }
            return { type: types.nodeWsSystemChain.failed };
          }),
        );
      },
    ),
  );

const pollingEpic = action$ =>
  action$.pipe(
    ofType(types.nodeWsSystemChainPolling.requested),
    // take(1),
    mergeMap(() => {
      console.log('nodeWsSystemChainPolling interval');
      return interval(config.connectivity.latency.period).pipe(
        map(() => {
          return { type: types.nodeWsSystemChain.requested, payload: {}};
        }));
    })
  );

export default [epic, pollingEpic];
