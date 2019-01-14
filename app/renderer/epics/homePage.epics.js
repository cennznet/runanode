import { EMPTY, from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import history from 'renderer/history';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { getTermsOfUseAcceptance } from 'renderer/api/utils/storage';

const homePageLoadEpic = (action$, state$) =>
  action$.pipe(
    ofType(types.homePageLoad.triggered),
    mergeMap(async () => {
      const isAccepted = await getTermsOfUseAcceptance();

      if (!isAccepted) {
        return { type: types.navigation.triggered, payload: ROUTES.TERMS_OF_USE_ACCEPTANCE };
      }

      // TODO: if (syncBlocks !== 100%) redirect to syncPage

      return { type: types.nodeJsonRpcSystem.requested };
    })
  );

export default [homePageLoadEpic];
