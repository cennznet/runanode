import { EMPTY, from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';

const initEpic = action$ =>
  action$.pipe(
    ofType(types.init.triggered),
    mergeMap(() => {
      return of(
        {
          type: types.syncStream.requested,
        },
        {
          type: types.syncRemoteStream.requested,
        },
        {
          type: types.getRememberNetwork.requested,
        },
        {
          type: types.getSelectedNetwork.requested,
        }
      );
    })
  );

export default initEpic;
