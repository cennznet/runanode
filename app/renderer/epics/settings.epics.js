import { EMPTY, from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import {
  setTermsOfUseAcceptance,
  reset,
  getTermsOfUseAcceptance,
  getRememberSelectedNetwork,
  setRememberSelectedNetwork,
} from 'renderer/api/utils/storage';

const acceptTermsOfUseEpic = action$ =>
  action$.pipe(
    ofType(types.acceptTermsOfUse.triggered),
    mergeMap(async () => {
      await setTermsOfUseAcceptance();
      return { type: types.navigation.triggered, payload: ROUTES.WALLET.CREATE };
    })
  );

const resetLocalStorageEpic = action$ =>
  action$.pipe(
    ofType(types.resetLocalStorage.triggered),
    mergeMap(async () => {
      await reset();
      return { type: '' };
    })
  );

const toggleRememberNetworkEpic = action$ =>
  action$.pipe(
    ofType(types.toggleRememberNetwork.requested),
    mergeMap(async ({ payload }) => {
      await setRememberSelectedNetwork(payload);
      const getRememberNetwork = await getRememberSelectedNetwork();
      return { type: types.toggleRememberNetwork.completed, payload: getRememberNetwork };
    })
  );

const getRememberNetworkEpic = action$ =>
  action$.pipe(
    ofType(types.getRememberNetwork.requested),
    mergeMap(async () => {
      const getRememberNetwork = await getRememberSelectedNetwork();
      return { type: types.getRememberNetwork.completed, payload: getRememberNetwork };
    })
  );

export default [
  acceptTermsOfUseEpic,
  resetLocalStorageEpic,
  toggleRememberNetworkEpic,
  getRememberNetworkEpic,
];
