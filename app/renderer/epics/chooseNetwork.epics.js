import { EMPTY, from, of, zip } from 'rxjs';
import { mergeMap, map, concat } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { storageKeys } from 'renderer/api/utils/storage';
import chainEpics from 'renderer/epics/chainEpics';

const filterGenesisFile = file => {
  if (!file) {
    return null;
  }
  const { path, name, size } = file;
  return { path, name, size };
};

const storeNetworkOptionEpic = action$ =>
  action$.pipe(
    ofType(types.storeNetworkOption.triggered),
    mergeMap(({ payload }) => {
      const { selectedNetwork, genesisFile } = payload;
      return of(
        {
          type: types.setStorage.requested,
          payload: { key: storageKeys.SELECTED_NETWORK, value: selectedNetwork },
        },
        {
          type: types.setStorage.requested,
          payload: {
            key: storageKeys.GENESIS_CONFIG_FILE_INFO,
            value: filterGenesisFile(genesisFile),
          },
        }
      );
    })
  );

const navigationAfterStorageChian = chainEpics(
  types.setStorage.completed,
  types.navigation.triggered,
  ROUTES.SYNC_NODE
);

export default [storeNetworkOptionEpic, navigationAfterStorageChian];
