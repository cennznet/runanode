import { mergeMap, tap, catchError, filter, map, take, startWith } from 'rxjs/operators';
import { of, interval, merge, EMPTY } from 'rxjs';
import { ofType } from 'redux-observable';

import types from 'renderer/types';
import config from 'renderer/utils/config';
import { remoteStream as stream } from 'renderer/stream/stream';

const streamType = types.remoteStream;
const streamMessageType = types.remoteStreamMessage;
const streamStatusType = types.remoteStreamStatus;
const streamPingType = types.remoteStreamPing;

const connectStreamEpic = action$ =>
  action$.pipe(
    ofType(streamType.requested),
    mergeMap(() => {
      stream.connect();

      const streamMessage = stream.messageSubject.pipe(
        map(payload => ({
          type: streamMessageType.changed,
          payload,
        })));

      const streamStatus = stream.statusSubject.pipe(
        map(payload => ({
          type: streamStatusType.changed,
          payload,
        })));

      return merge(streamMessage, streamStatus);
    }),
    startWith({
      type: streamType.completed,
    }),
  );

// send ping periodically after connected
// currently it doesn't stop/pause after disconnected
// but ping while disconnected is nop anyway
const pingEpic = action$ =>
  action$.pipe(
    ofType(streamStatusType.changed),
    filter(({ payload: { isConnected } }) => isConnected),
    take(1),
    mergeMap(() => {
      return interval(config.connectivity.latency.period).pipe(
        map(() => {
          return { type: streamPingType.requested, payload: Date.now() };
        }));
    }),
  );

// send a ping immediately after connected
const pingOnConnectEpic = action$ =>
  action$.pipe(
    ofType(streamStatusType.changed),
    filter(({ payload: { isConnected } }) => isConnected),
    map(() => {
      return { type: streamPingType.requested, payload: Date.now() };
    }),
  );

const pongEpic = action$ =>
  action$.pipe(
    ofType(streamPingType.requested),
    mergeMap(() => {
      const id = stream.ping();
      if (!id) {
        return EMPTY;
      }
      return action$.pipe(
        ofType(streamMessageType.changed),
        filter(action => (action.payload.id === id)),
        take(1),
        map(() => {
          return { type: streamPingType.completed, payload: Date.now() };
        }),
      );
    }),
  );

export default [connectStreamEpic, pingOnConnectEpic, pingEpic, pongEpic];
