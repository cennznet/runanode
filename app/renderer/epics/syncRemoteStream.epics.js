import { of, interval, merge, EMPTY } from 'rxjs';
import {
  mergeMap,
  switchMap,
  catchError,
  filter,
  map,
  take,
  startWith,
  concat,
} from 'rxjs/operators';
import { ofType } from 'redux-observable';
import R from 'ramda';
import sreamConstants from 'renderer/constants/stream';
import types from 'renderer/types';
import config from 'app/config';
import { remoteStream as stream } from 'renderer/stream/stream';
import streamTypes from '../stream/types';

const streamType = types.syncRemoteStream;
const streamMessageType = types.syncRemoteStreamMessage;
const streamStatusType = types.syncRemoteStreamStatus;
const streamPingType = types.syncRemoteStreamPing;

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
      return interval(config.webSocket.latency.period).pipe(
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
      if (payload.command === sreamConstants.CONNECT) {
        stream.connect();
        return merge(messageSubject$, statusSubject$);
      }

      if (payload.command === sreamConstants.DISCONNECT) {
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
