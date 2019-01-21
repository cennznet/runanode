import { EMPTY, from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { storageKeys, getStorage } from 'renderer/api/utils/storage';
import { NetworkNameOptions } from 'common/types/cennznet-node.types';

const homePageLoadEpic = (action$, state$) =>
  action$.pipe(
    ofType(types.homePageLoad.triggered),
    mergeMap(async () => {
      const isTosAccepted = await getStorage(storageKeys.TERMS_OF_USE_ACCEPTANCE);
      const isNetworkRemembered = await getStorage(storageKeys.REMEMBER_NETWORK);
      const selectedNetwork = await getStorage(storageKeys.SELECTED_NETWORK);
      const genesisConfigFileInfo = await getStorage(storageKeys.GENESIS_CONFIG_FILE_INFO);
      const genesisConfigFilePath = genesisConfigFileInfo && genesisConfigFileInfo.path;

      if (!isTosAccepted) {
        return { type: types.navigation.triggered, payload: ROUTES.TERMS_OF_USE_ACCEPTANCE };
      }

      if (isNetworkRemembered && selectedNetwork) {
        if (
          (selectedNetwork === NetworkNameOptions.LOCAL_TESTNET && genesisConfigFilePath) ||
          selectedNetwork !== NetworkNameOptions.LOCAL_TESTNET
        )
          return { type: types.navigation.triggered, payload: ROUTES.SYNC_NODE };
      }

      return { type: types.navigation.triggered, payload: ROUTES.CHOOSE_NETWORK };
    })
  );

export default [homePageLoadEpic];
