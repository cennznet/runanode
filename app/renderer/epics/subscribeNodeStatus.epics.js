import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import types from 'renderer/types';
import { cennznetStateChangeChannel, cennznetStatusChannel } from 'renderer/ipc/cennznet.ipc';
import { Logger } from 'renderer/utils/logging';
import ROUTES from 'renderer/constants/routes';

const subscribeNodeStatusEpic = () =>
  new Observable(observer => {
    Logger.debug(`subscribeNodeStatus call::`);
    cennznetStatusChannel.onReceive(status => {
      observer.next(status);
    });
  }).pipe(
    map(status => {
      Logger.debug(`subscribeNodeStatus status.isNodeSafeExisting:: <${status}>`);
      if (status.isNodeSafeExisting) {
        return {
          type: types.navigation.triggered,
          payload: ROUTES.WAIT,
        };
      }
      return {
        type: types.cenznetStatusChange.triggered,
        payload: status,
      };
    })
  );

export default [subscribeNodeStatusEpic];
