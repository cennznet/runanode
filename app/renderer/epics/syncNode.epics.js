import { EMPTY, from, of } from 'rxjs';
import { mergeMap, map, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { setSelectedNetwork } from 'renderer/api/utils/storage';

const storeSelectedNetworkEpic = action$ =>
  action$.pipe(
    ofType(types.storeSelectedNetwork.triggered),
    tap(async ({ payload }) => {
      await setSelectedNetwork(payload);
    }),
    mergeMap(() => EMPTY)
  );

export default [storeSelectedNetworkEpic];
