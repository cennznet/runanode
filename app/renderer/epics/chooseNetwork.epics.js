import { EMPTY, from, of, zip } from 'rxjs';
import { mergeMap, map, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { setSelectedNetwork, setUploadedFileInfo } from 'renderer/api/utils/storage';
import chainEpics from 'renderer/epics/chainEpics';

const storeNetworkOptionEpic = action$ =>
  action$.pipe(
    ofType(types.storeNetworkOption.requested),
    mergeMap(async ({ payload: { selectedNetwork, uploadedFileInfo } }) => {
      await setSelectedNetwork(selectedNetwork);
      uploadedFileInfo && (await setUploadedFileInfo(uploadedFileInfo.path)); // TODO: Optimize
      return { type: types.storeNetworkOption.completed };
    })
  );

const setSelectedNetworkEpic = chainEpics(
  types.storeNetworkOption.completed,
  types.getSelectedNetwork.requested
);

const setUploadedFileInfoEpic = chainEpics(
  types.storeNetworkOption.completed,
  types.getUploadedFileInfo.requested
);

const chainNavigationAfterStore = action$ =>
  zip(
    action$.ofType(types.storeNetworkOption.completed),
    action$.ofType(types.getSelectedNetwork.completed)
  ).pipe(map(() => ({ type: types.navigation.triggered, payload: ROUTES.SYNC_NODE })));

export default [
  storeNetworkOptionEpic,
  setSelectedNetworkEpic,
  setUploadedFileInfoEpic,
  chainNavigationAfterStore,
];
