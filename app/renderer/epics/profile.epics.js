import { EMPTY, from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import {
  setTermsOfUseAcceptance,
  unsetTermsOfUseAcceptance,
  getTermsOfUseAcceptance,
} from 'renderer/api/utils/storage';

const acceptTermsOfUseEpic = action$ =>
  action$.pipe(
    ofType(types.acceptTermsOfUse.triggered),
    mergeMap(async () => {
      await setTermsOfUseAcceptance();
      return { type: types.navigation.triggered, payload: ROUTES.WALLET.IMPORT };
    })
  );

const resetTermsOfUseEpic = action$ =>
  action$.pipe(
    ofType(types.resetTermsOfUse.triggered),
    mergeMap(async () => {
      await unsetTermsOfUseAcceptance();
      return { type: '' };
    })
  );

export default [acceptTermsOfUseEpic, resetTermsOfUseEpic];
