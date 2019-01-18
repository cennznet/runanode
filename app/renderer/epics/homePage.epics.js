import { EMPTY, from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import history from 'renderer/history';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { storageKeys, getStorage } from 'renderer/api/utils/storage';

const homePageLoadEpic = (action$, state$) =>
  action$.pipe(
    ofType(types.homePageLoad.triggered),
    mergeMap(async () => {
      const isTosAccepted = await getStorage(storageKeys.TERMS_OF_USE_ACCEPTANCE);
      const isNetworkRemembered = await getStorage(storageKeys.REMEMBER_NETWORK);
      const selectedNetwork = await getStorage(storageKeys.SELECTED_NETWORK);
      const genesisConfigFilePath = await getStorage(storageKeys.GENESIS_CONFIG_FILE_PATH);

      if (!isTosAccepted) {
        return { type: types.navigation.triggered, payload: ROUTES.TERMS_OF_USE_ACCEPTANCE };
      }

      if (selectedNetwork) {
        if (
          (selectedNetwork === 'local-testnet' && genesisConfigFilePath) ||
          selectedNetwork !== 'local-testnet'
        )
          return { type: types.navigation.triggered, payload: ROUTES.SYNC_NODE };
      }

      return { type: types.navigation.triggered, payload: ROUTES.CHOOSE_NETWORK };
    })
  );

export default [homePageLoadEpic];
