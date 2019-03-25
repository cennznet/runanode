import { EMPTY, from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';
import { storageKeys, getStorage } from 'renderer/api/utils/storage';

const initEpic = action$ =>
  action$.pipe(
    ofType(types.init.triggered),
    mergeMap(() => {
      return of(
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.ENABLE_ANALYTICS },
        },
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.TERMS_OF_USE_ACCEPTANCE },
        },
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.REMEMBER_NETWORK },
        },
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.SELECTED_NETWORK },
        },
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.GENESIS_CONFIG_FILE_INFO },
        },
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.WALLETS },
        },
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.STAKING_STASH_ACCOUNT_ADDRESS },
        },
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.STAKING_STASH_WALLET_ID },
        },
        {
          type: types.getStorage.requested,
          payload: { key: storageKeys.STAKING_PREFERENCE },
        },
        {
          type: types.subscribeValidators.triggered,
        },
        {
          type: types.nodeWsSystemChainPolling.requested,
        },
        { type: types.subscribeNewHead.triggered },
        { type: types.subscribeNewHeadRemote.triggered },
        { type: types.subscribeFinalisedHeads.triggered },
      );
    })
  );

export default initEpic;
