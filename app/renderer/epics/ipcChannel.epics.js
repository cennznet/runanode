import { Observable } from 'rxjs/Observable';
import { map, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import { theNodeStateChangeChannel, theNodeStatusChannel } from 'renderer/ipc/theNode.ipc';
import { Logger } from 'renderer/utils/logging';

const nodeStateChannelEpic = () =>
  new Observable(observer => {
    theNodeStateChangeChannel.onReceive(state => {
      Logger.debug(`theNodeStateChangeChannel.onReceive: ${state}`);
      observer.next(state);
    });
  }).pipe(
    map(state => {
      return {
        type: types.nodeStateChange.triggered,
        payload: state,
      };
    })
  );

const sendNodeStatusToIpcMainEpic = action$ => {
  return action$.pipe(
    ofType(types.sendNodeStatusToIpcMain.requested),
    mergeMap(async ({ payload }) => {
      const request = await theNodeStatusChannel.send(payload);

      return { type: types.sendNodeStatusToIpcMain.completed };
    })
  );
};

export default [nodeStateChannelEpic, sendNodeStatusToIpcMainEpic];
