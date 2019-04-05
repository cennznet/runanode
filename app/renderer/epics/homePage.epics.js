import { EMPTY, from, of } from 'rxjs';
import { mergeMap, catchError, map, debounceTime } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { storageKeys, getStorage } from 'renderer/api/utils/storage';
import { NetworkNameMapping } from 'common/types/cennznet-node.types';
import { Logger } from 'renderer/utils/logging';
import { Observable } from 'rxjs/Observable';

const homePageNavigationEpic = (action$, state$) =>
  action$.pipe(
    ofType(types.homePageNavigation.triggered),
    mergeMap(async () => {
      Logger.debug(`HomePageNavigationEpic call::`);
      const isTosAccepted = await getStorage(storageKeys.TERMS_OF_USE_ACCEPTANCE);
      const isNetworkRemembered = await getStorage(storageKeys.REMEMBER_NETWORK);
      const selectedNetwork = await getStorage(storageKeys.SELECTED_NETWORK);
      const genesisConfigFileInfo = await getStorage(storageKeys.GENESIS_CONFIG_FILE_INFO);
      const genesisConfigFilePath = genesisConfigFileInfo && genesisConfigFileInfo.path;

      Logger.debug(
        `HomePageNavigationEpic, isTosAccepted: ${isTosAccepted} isNetworkRemembered ${isNetworkRemembered}, genesisConfigFilePath: ${genesisConfigFilePath}, selectedNetwork: ${JSON.stringify(
          selectedNetwork
        )}`
      );
      if (!isTosAccepted) {
        return { type: types.navigation.triggered, payload: ROUTES.TERMS_OF_USE_ACCEPTANCE };
      }

      if (
        isNetworkRemembered !== false &&
        ((selectedNetwork === NetworkNameMapping.Development && genesisConfigFilePath) ||
          selectedNetwork !== NetworkNameMapping.Development)
      ) {
        Logger.debug(`HomePageNavigationEpic,navigation to ROUTES.SYNC_NODE`);
        return { type: types.navigation.triggered, payload: ROUTES.SYNC_NODE };
      }

      return { type: types.navigation.triggered, payload: ROUTES.CHOOSE_NETWORK };
    }),
    catchError(err => {
      Logger.debug(`Error in HomePageNavigationEpic: ${err}`);
      return of({ type: types.navigation.triggered, payload: ROUTES.TERMS_OF_USE_ACCEPTANCE });
    })
  );

export default [homePageNavigationEpic];
