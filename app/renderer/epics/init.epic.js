import { EMPTY, from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import sreamConstants from 'renderer/constants/stream';
import { storageKeys } from 'renderer/api/utils/storage';

const initEpic = action$ =>
  action$.pipe(
    ofType(types.init.triggered),
    mergeMap(() => {
      return of(
        {
          type: types.syncStream.requested,
          payload: { command: sreamConstants.CONNECT },
        },
        {
          type: types.syncRemoteStream.requested,
          payload: { command: sreamConstants.CONNECT },
        },
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.TERMS_OF_USE_ACCEPTANCE },
        },
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.REMEMBER_NETWORK },
        },
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.SELECTED_NETWORK },
        },
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.GENESIS_CONFIG_FILE_PATH },
        },
        {
          type: types.nodeWsSystemChainPolling.requested,
        }
      );
    })
  );

export default initEpic;
