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
import objectPath from 'object-path';

import types from 'renderer/types';
import config from 'renderer/utils/config';
import { localStream as stream } from 'renderer/stream/stream';
import streamTypes from '../stream/types';

const streamType = types.syncStream;
const streamMessageType = types.syncStreamMessage;
const streamStatusType = types.syncStreamStatus;
const streamPingType = types.syncStreamPing;

const connectStreamEpic = action$ =>
  action$.pipe(
    ofType(streamType.requested),
    switchMap(({ payload }) => {
      if (payload.command === 'START') {
        console.log('START STREAM');

        stream.connect();

        const streamMessage = stream.messageSubject.pipe(
          map(message => {
            console.log('stream.connect streamMessage', message);
            return {
              type: streamMessageType.changed,
              payload: message,
            };
          })
        );

        const streamStatus = stream.statusSubject.pipe(
          mergeMap(status => {
            console.log('stream.connect streamStatus', status);
            if (status.isConnected) {
              return interval(config.connectivity.latency.period).pipe(
                map(() => {
                  console.log('streamStatus.changed INTERVAL');
                  return { type: streamPingType.requested, payload: Date.now() };
                })
              );
            }

            return EMPTY;
          })
        );

        return merge(streamMessage, streamStatus);
      }

      if (payload.command === 'STOP') {
        console.log('STOP STREAM');
        console.log('local stream.disconnect()');
        stream.disconnect();
        return EMPTY;
      }
    })
  );

const pongEpic = action$ =>
  action$.pipe(
    ofType(streamPingType.requested),
    mergeMap(() => {
      const id = stream.pingWithStreamType(streamTypes.chainGetHeader);
      console.log('streamPing.requested', id);

      if (!id) {
        return EMPTY;
      }
      return action$.pipe(
        ofType(streamMessageType.changed),
        filter(action => action.payload.id === id),
        take(1),
        map(payload => {
          const result = objectPath.get(payload, 'payload.result', null);
          return { type: streamPingType.completed, payload: result };
        })
      );
    })
  );

export default [connectStreamEpic, pongEpic];
