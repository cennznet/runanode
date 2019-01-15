import { EMPTY, from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import history from 'renderer/history';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { getTermsOfUseAcceptance, getRememberSelectedNetwork } from 'renderer/api/utils/storage';

const homePageLoadEpic = (action$, state$) =>
  action$.pipe(
    ofType(types.homePageLoad.triggered),
    mergeMap(async () => {
      const localBlockNum = state$.value.syncStream.blockNum;
      const remoteBlockNum = state$.value.syncRemoteStream.blockNum;

      if (localBlockNum !== null && remoteBlockNum !== null && remoteBlockNum !== 0) {
        const syncPercentage = localBlockNum / remoteBlockNum;

        const isTosAccepted = await getTermsOfUseAcceptance();
        const isNetworkRemembered = await getRememberSelectedNetwork();

        if (!isTosAccepted) {
          return { type: types.navigation.triggered, payload: ROUTES.TERMS_OF_USE_ACCEPTANCE };
        }

        if (syncPercentage < 1) {
          // if (isNetworkRemembered) {
          //   return { type: types.navigation.triggered, payload: ROUTES.SYNC_NODE };
          // }
          return { type: types.navigation.triggered, payload: ROUTES.CHOOSE_NETWORK };
        }
      }

      return { type: '' };
    })
  );

export default [homePageLoadEpic];
