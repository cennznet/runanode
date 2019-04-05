import { of } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { concat, map, mergeMap } from 'rxjs/operators';
import types from 'renderer/types';
import { cennznetStatusChannel } from 'renderer/ipc/cennznet.ipc';
import { Logger } from 'renderer/utils/logging';
import ROUTES from 'renderer/constants/routes';

const subscribeNodeStatusEpic = () =>
  new Observable(observer => {
    Logger.debug(`subscribeNodeStatus call::`);
    cennznetStatusChannel.onReceive(status => {
      observer.next(status);
    });
  }).pipe(
    mergeMap(status => {
      Logger.debug(`subscribeNodeStatus:: ${JSON.stringify(status)}`);
      if (status.isNodeSafeExisting) {
        return of({
          type: types.navigation.triggered,
          payload: ROUTES.WAIT,
        });
      }

      if (status.isNodeInStaking) {
        return of({
          type: types.cenznetStatusChange.triggered,
          payload: status,
        }).pipe(
          concat(
            of({
              type: types.toggleGlobalModal.triggered,
              payload: {
                isOpen: true,
                type: 'EXIT_APP_WHILE_STAKING_MODAL',
              },
            })
          )
        );
      }

      return {
        type: types.cenznetStatusChange.triggered,
        payload: status,
      };
    })
  );

export default [subscribeNodeStatusEpic];
