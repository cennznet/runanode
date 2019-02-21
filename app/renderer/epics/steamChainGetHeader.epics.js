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
import { of, interval, merge, EMPTY } from 'rxjs';
import { ofType } from 'redux-observable';

import types from 'renderer/types';
import streamTypes from 'renderer/stream/types';
import {
  getStream,
  getStreamMessageChangedType,
  getNodeWsChainGetHeaderType,
} from 'renderer/helpers/actionTypeHelper';
import config from 'app/config';

const epic = (action$, state$) =>
  action$.pipe(
    ofType(types.nodeWsChainGetHeader.requested, types.nodeWsRemoteChainGetHeader.requested),
    mergeMap(actionValue => {
      const id = getStream(actionValue).send(streamTypes.chainGetHeader, {});
      if (!id) {
        return EMPTY;
      }
      return action$.pipe(
        ofType(getStreamMessageChangedType(actionValue).changed),
        filter(action => action.payload.id === id),
        map(({ payload }) => {
          const data = R.pathOr(null, ['result'], payload);
          if (data) {
            return { type: getNodeWsChainGetHeaderType(actionValue).completed, payload: data };
          }
          return { type: getNodeWsChainGetHeaderType(actionValue).failed };
        })
      );
    })
  );

const pollingEpic = action$ =>
  action$.pipe(
    ofType(types.nodeWsChainGetHeaderPolling.requested),
    mergeMap(() => {
      return interval(config.webSocket.latency.period).pipe(
        map(() => {
          return { type: types.nodeWsChainGetHeader.requested, payload: {} };
        })
      );
    })
  );

export default [epic, pollingEpic];
