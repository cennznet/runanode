import { EMPTY, from, of, zip } from 'rxjs';
import { mergeMap, map, concat } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { storageKeys } from 'renderer/api/utils/storage';
import chainEpics from 'renderer/epics/chainEpics';

const storeNetworkOptionEpic = action$ =>
  action$.pipe(
    ofType(types.storeNetworkOption.triggered),
    mergeMap(({ payload }) => {
      return of({
        type: types.setStorage.requested,
        payload: { key: storageKeys.SELECTED_NETWORK, value: payload },
      });
    })
  );

const storeUploadedGenesisFileEpic = action$ =>
  action$.pipe(
    ofType(types.storeUploadedGenesisInfo.triggered),
    mergeMap(({ payload: { path, name, size } }) => {
      return of({
        type: types.setStorage.requested,
        payload: {
          key: storageKeys.GENESIS_CONFIG_FILE_INFO,
          value: { path, name, size },
        },
      });
    })
  );

export default [storeNetworkOptionEpic, storeUploadedGenesisFileEpic];
