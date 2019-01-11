import { EMPTY, from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';
import { setSelectedNetwork } from 'renderer/api/utils/storage';

const storeSelectedNetworkEpic = action$ =>
  action$.pipe(
    ofType(types.storeSelectedNetwork.triggered),
    mergeMap(async payload => {
      await setSelectedNetwork(payload);
      console.log('storeSelectedNetworkEpic', payload);
      return { type: types.navigation.triggered, payload: ROUTES.SYNC_NODE };
    })
  );

export default [storeSelectedNetworkEpic];
