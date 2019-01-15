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
      await setUploadedFileInfo(uploadedFileInfo.path); // TODO: Optimize
      console.log('***storeNetworkOptionEpic', uploadedFileInfo);
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

// TODO: Optimize
const chainNavigationAfterStore = chainEpics(
  types.getSelectedNetwork.completed,
  types.navigation.triggered,
  ROUTES.SYNC_NODE
);

export default [
  storeNetworkOptionEpic,
  setSelectedNetworkEpic,
  setUploadedFileInfoEpic,
  chainNavigationAfterStore,
];
