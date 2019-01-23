import { EMPTY, from, of, zip } from 'rxjs';
import { mergeMap, map, concat, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { storageKeys } from 'renderer/api/utils/storage';
import chainEpics from 'renderer/epics/chainEpics';
import sreamConstants from 'renderer/constants/stream';
import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';

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
      ).pipe(concat(of({ type: types.navigation.triggered, payload: ROUTES.SYNC_NODE })));
    })
  );

const switchNetworkChain = chainEpics(
  types.switchNetwork.triggered,
  types.stopStream.requested,
  payload => payload
);

const stopStreamEpic = action$ =>
  action$.pipe(
    ofType(types.stopStream.requested),
    mergeMap(({ payload }) => {
      return of(
        {
          type: types.syncStream.requested,
          payload: { command: sreamConstants.DISCONNECT },
        },
        {
          type: types.syncRemoteStream.requested,
          payload: { command: sreamConstants.DISCONNECT },
        },
        {
          type: types.stopStream.completed,
          payload,
        }
      );
    })
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
          type: types.syncStream.requested,
          payload: { command: sreamConstants.CONNECT },
        },
        {
          type: types.syncRemoteStream.requested,
          payload: { command: sreamConstants.CONNECT },
        },
        {
          type: types.nodeWsSystemChainPolling.requested,
        }
      )
    )
  );

export default [
  storeNetworkOptionEpic,
  switchNetworkChain,
  stopStreamEpic,
  restartNodeWithNetworkChain,
  restartNodeEpic,
];
