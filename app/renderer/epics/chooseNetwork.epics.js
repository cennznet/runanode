import { EMPTY, from, of, zip } from 'rxjs';
import { mergeMap, map, concat, tap, mapTo, filter, withLatestFrom, debounceTime } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { storageKeys } from 'renderer/api/utils/storage';
import chainEpics from 'renderer/epics/chainEpics';
import { restartTheNetNodeChannel } from 'renderer/ipc/theNode.ipc';
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
          payload: {
            key: storageKeys.GENESIS_CONFIG_FILE_INFO,
            value: filterGenesisFile(genesisFile),
          },
        }
      ).pipe(concat(of( // wait for save GENESIS_CONFIG_FILE_INFO finish
        {
          type: types.setStorage.requested,
          payload: { key: storageKeys.SELECTED_NETWORK, value: selectedNetwork },
        },
      )));
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

const switchNetworkEpic = action$ =>
  action$.pipe(
    ofType(types.nodeStateChange.triggered),
    withLatestFrom(action$.ofType(types.switchNetwork.triggered)),
    mergeMap(([nodeStateChangeAction, switchNetworkAction]) => {
      Logger.debug(`switchNetworkEpic, nodeStateChangeAction: ${nodeStateChangeAction.payload}, switchNetworkAction: ${JSON.stringify(switchNetworkAction)}`);
      const { chain } = switchNetworkAction.payload;
      if ( nodeStateChangeAction.payload === 'stopping' && chain ) {
        window.appApi.switchNetwork(chain);
      }
      return of(
        { type: types.subscribeNewHead.triggered },
        { type: types.subscribeNewHeadRemote.triggered },
        { type: types.subscribeFinalizedHeads.triggered },
        { type: types.switchNetwork.triggered, payload: {} },
      );
    })
  );

const restartNodeWithNetworkChain = chainEpics(
  types.switchNetwork.triggered,
  types.restartNode.triggered,
  payload => payload
);

const restartNodeEpic = action$ =>
  action$.pipe(
    ofType(types.restartNode.triggered),
    tap(({ payload }) => {
      Logger.debug(`restartNodeEpic, payload: ${JSON.stringify(payload)}`);
      const { chain } = payload;
      const options: TheNodeRestartOptions = payload;
      if(chain) {
        restartTheNetNodeChannel.send(options);
      }
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
  restartNodeWithNetworkChain,
  restartNodeEpic,
  navigationAfterStoreNetworkEpic,
  switchNetworkEpic,
];
