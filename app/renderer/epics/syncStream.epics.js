import { of, interval, merge, EMPTY } from 'rxjs';
import { catchError, concat, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import R from 'ramda';
import types from 'renderer/types';
import config from 'renderer/utils/config';
import { localStream as stream } from 'renderer/stream/stream';
import streamTypes from '../stream/types';

const streamType = types.syncStream;
const streamMessageType = types.syncStreamMessage;
const streamStatusType = types.syncStreamStatus;
const streamPingType = types.syncStreamPing;

const messageSubject$ = stream.messageSubject.pipe(
  map(message => {
    return {
      type: streamMessageType.changed,
      payload: message,
    };
  })
);

const statusSubject$ = stream.statusSubject.pipe(
  mergeMap(status => {
    if (status.isConnected) {
      return interval(config.connectivity.latency.period).pipe(
        map(() => {
          return { type: streamPingType.requested, payload: Date.now() };
        })
      );
    }

    return EMPTY;
  })
);

const connectStreamEpic = action$ =>
  action$.pipe(
    ofType(streamType.requested),
    switchMap(({ payload }) => {
      if (payload.command === 'START') {
        stream.connect();
        return merge(messageSubject$, statusSubject$);
      }

      if (payload.command === 'STOP') {
        stream.disconnect();
        return EMPTY;
      }
    })
  );

const streamPingEpic = action$ =>
  action$.pipe(
    ofType(streamPingType.requested),
    mergeMap(() => {
      const id = stream.pingWithStreamType(streamTypes.chainGetHeader);

      if (!id) {
        return EMPTY;
      }
      return action$.pipe(
        ofType(streamMessageType.changed),
        filter(action => action.payload.id === id),
        map(({ payload }) => {
          const result = R.pathOr(null, ['result'], payload);
          return { type: streamPingType.completed, payload: result };
        })
      );
    })
  );

export default [connectStreamEpic, streamPingEpic];
