import { of } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { concat, map, mergeMap } from 'rxjs/operators';
import types from 'renderer/types';
import { theNodeStatusChannel } from 'renderer/ipc/theNode.ipc';
import { Logger } from 'renderer/utils/logging';
import ROUTES from 'renderer/constants/routes';

const subscribeNodeStatusEpic = () =>
  new Observable(observer => {
    Logger.debug(`subscribeNodeStatus call::`);
    theNodeStatusChannel.onReceive(status => {
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
          type: types.theNodeStatusChange.triggered,
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

      return of({
        type: types.theNodeStatusChange.triggered,
        payload: status,
      }).pipe(
        concat(
          of({
            type: types.toggleGlobalModal.triggered,
            payload: {
              isOpen: false,
              type: 'EXIT_APP_WHILE_STAKING_MODAL',
            },
          })
        )
      );
    })
  );

export default [subscribeNodeStatusEpic];
