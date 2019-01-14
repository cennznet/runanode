import { mergeMap, tap, catchError, filter, map, take, startWith } from 'rxjs/operators';
import { of, interval, merge, EMPTY } from 'rxjs';
import { ofType } from 'redux-observable';
import objectPath from "object-path";

import types from 'renderer/types';
import config from 'renderer/utils/config';
import { remoteStream as stream } from 'renderer/stream/stream';
import streamTypes from '../stream/types';


const streamType = types.syncRemoteStream;
const streamMessageType = types.syncRemoteStreamMessage;
const streamStatusType = types.syncRemoteStreamStatus;
const streamPingType = types.syncRemoteStreamPing;

const connectStreamEpic = action$ =>
  action$.pipe(
    ofType(streamType.requested),
    mergeMap(() => {
      stream.connect();

      const streamMessage = stream.messageSubject.pipe(
        map(payload =>  {
          console.log(`sync remote streamMessage`);
          console.log(payload);
          return ({
              type: streamMessageType.changed,
              payload
            });
          }
        ));

      const streamStatus = stream.statusSubject.pipe(
        map(payload => ({
          type: streamStatusType.changed,
          payload
        })));

      return merge(streamMessage, streamStatus);
    }),
    startWith({
      type: streamType.completed,
    })
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
    })
  );

// send a ping immediately after connected
const pingOnConnectEpic = action$ =>
  action$.pipe(
    ofType(streamStatusType.changed),
    filter(({ payload: { isConnected } }) => isConnected),
    map(() => {
      return { type: streamPingType.requested, payload: Date.now() };
    })
  );

const pongEpic = action$ =>
  action$.pipe(
    ofType(streamPingType.requested),
    mergeMap(() => {
      const id = stream.pingWithStreamType(streamTypes.chainGetHeader);
      if (!id) {
        return EMPTY;
      }
      return action$.pipe(
        ofType(streamMessageType.changed),
        filter(action => (action.payload.id === id)),
        take(1),
        map((payload) => {
          const result = objectPath.get(payload, 'payload.result', null);
          return { type: streamPingType.completed, payload: result };
        })
      );
    })
  );

export default [connectStreamEpic, pingOnConnectEpic, pingEpic, pongEpic];
