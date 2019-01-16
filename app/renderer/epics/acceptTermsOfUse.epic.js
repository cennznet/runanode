import { of } from 'rxjs';
import { mergeMap, concat } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { storageKeys, setStorage } from 'renderer/api/utils/storage';

const acceptTermsOfUseEpic = action$ =>
  action$.pipe(
    ofType(types.acceptTermsOfUse.triggered),
    mergeMap(() => {
      return of({
        type: types.setStorage.requested,
        payload: { key: storageKeys.TERMS_OF_USE_ACCEPTANCE, value: true },
      }).pipe(concat(of({ type: types.navigation.triggered, payload: ROUTES.CHOOSE_NETWORK })));
    })
  );

export default acceptTermsOfUseEpic;
