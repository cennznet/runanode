import { empty } from 'rxjs/observable/empty';
import { mergeMap, tap, catchError, filter, map, take, startWith } from 'rxjs/operators';
import { of, interval, merge } from 'rxjs';
import { ofType } from 'redux-observable';

import types from 'renderer/types';
import config from 'renderer/utils/config';
import urls from 'renderer/constants/urls';
import stream from 'renderer/stream/stream';

const connectStreamEpic = action$ =>
  action$.pipe(
    ofType(types.stream.requested),
    mergeMap(() => {
      stream.connect(urls.API.WS);

      const streamMessage = stream.messageSubject
        .map(payload => ({
          type: types.streamMessage.changed,
          payload
        }));

      const streamStatus = stream.statusSubject
        .map(payload => ({
          type: types.streamStatus.changed,
          payload
        }));

      return merge(streamMessage, streamStatus)
        // .startWith({
        //   type: types.stream.completed
        // })
        ;
    }),
    startWith({
      type: types.stream.completed,
    })
  );

// send ping periodically after connected
// currently it doesn't stop/pause after disconnected
// but ping while disconnected is nop anyway
const pingEpic = action$ =>
  action$.pipe(
    ofType(types.streamStatus.changed),
    filter(({ payload: { isConnected } }) => isConnected),
    take(1),
    mergeMap(() => {
      return interval(config.connectivity.latency.period)
        .map(() => {
          return { type: types.streamPing.requested, payload: Date.now() };
        });
    })
  );

// send a ping immediately after connected
const pingOnConnectEpic = action$ =>
  action$.pipe(
    ofType(types.streamStatus.changed),
    filter(({ payload: { isConnected } }) => isConnected),
    map(() => {
      return { type: types.streamPing.requested, payload: Date.now() };
    })
  );

const pongEpic = action$ =>
  action$.pipe(
    ofType(types.streamPing.requested),
    mergeMap(() => {
      const id = stream.ping();
      if (!id) {
        return empty();
      }
      return action$.pipe(
        ofType(types.streamMessage.changed),
        filter(action => (action.payload.id === id)),
        take(1),
        map(() => {
          return { type: types.streamPing.completed, payload: Date.now() };
        })
     );
    })
  );

// const authEpic = action$ =>
//   combineLatest(action$.ofType(types.token.completed), action$.ofType(types.stream.completed))
//     .do(([{ payload: { accessToken } }]) => {
//       stream.authenticate(accessToken);
//     })
//     .ignoreElements();

// const deAuthEpic = action$ =>
//   action$.ofType(types.resetToken.completed)
//     .do(() => {
//       stream.disconnect();
//     })
//     .ignoreElements();

export default [connectStreamEpic, pingOnConnectEpic, pingEpic, pongEpic];
