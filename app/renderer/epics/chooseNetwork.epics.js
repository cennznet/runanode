import { EMPTY, from, of, zip } from 'rxjs';
import { mergeMap, map, concat, tap, mapTo, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { storageKeys } from 'renderer/api/utils/storage';
import chainEpics from 'renderer/epics/chainEpics';
import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import { Logger } from 'renderer/utils/logging';

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

const navigationAfterStoreNetworkEpic = action$ =>
  action$.ofType(types.setStorage.completed).pipe(
    filter(({ payload }) => payload.key === storageKeys.SELECTED_NETWORK),
    mergeMap(() => {
      return of({
        type: types.navigation.triggered,
        payload: ROUTES.SYNC_NODE,
      })
    })
  );

const switchNetworkChain = chainEpics(
  types.switchNetwork.triggered,
  types.stopStream.requested,
  payload => payload
);

const restartNodeWithNetworkChain = chainEpics(
  types.stopStream.completed,
  types.restartNode.triggered,
  payload => payload
);

const restartNodeEpic = action$ =>
  action$.pipe(
    ofType(types.restartNode.triggered),
    tap(({ payload }) => {
      const options: CennzNetRestartOptions = payload;
      restartCennzNetNodeChannel.send(options);
    }),
    mergeMap(() =>
      of(
        {
          type: ''
        },
      )
    )
  );

export default [
  storeNetworkOptionEpic,
  switchNetworkChain,
  restartNodeWithNetworkChain,
  restartNodeEpic,
  navigationAfterStoreNetworkEpic,
];
