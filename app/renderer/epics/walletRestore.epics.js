import { EMPTY, from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import history from 'renderer/history';
import types from 'renderer/types';
import { getTermsOfUseAcceptance } from 'renderer/api/utils/storage';

const walletRestorePageLoadEpic = action$ =>
  action$.pipe(
    ofType(types.walletRestorePageLoad.triggered),
    mergeMap(async () => {
      const isAccepted = await getTermsOfUseAcceptance();
      return { type: '' };
    }),
    catchError(err => Promise.resolve({ type: 'Error', message: err.message }))
  );

export default [walletRestorePageLoadEpic];
