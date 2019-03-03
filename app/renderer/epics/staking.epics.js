import { EMPTY, of, zip } from 'rxjs';
import { mergeMap, concat, filter, withLatestFrom } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import assert from 'assert';

import { storageKeys, setStorage } from 'renderer/api/utils/storage';
import types from 'renderer/types';
import chainEpics from 'renderer/epics/chainEpics';
import streamConstants from 'renderer/constants/stream';
import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import { Logger } from 'renderer/utils/logging';
import ROUTES from 'renderer/constants/routes';

const triggerStakingEpic = action$ =>
  action$.pipe(
    ofType(types.stakeAndRestartNode.triggered),
    mergeMap(async ({ payload }) => {
      const { wallet, stashAccountAddress, passphrase } = payload;

      const seed = await window.odin.api.cennz.getSeedFromWalletAccount(
        wallet,
        stashAccountAddress,
        passphrase
      );

      assert(seed, 'fail to get seed from wallet account');

      const cennzNetRestartOptions = { key: seed, isValidatorMode: true };

      const channelResponse = await restartCennzNetNodeChannel.send(cennzNetRestartOptions);

      return of({ type: types.sendStakingExtrinsic.triggered, payload });

      // Once running => sendStakeTx => navigate to overview => watchTx => chain toaster => chain setStorage

      // return of({
      //   type: types.setStorage.requested,
      //   payload: { key: storageKeys.STAKING, value: { stashAccountAddress } }, // TODO: store account type
      // })
      // .pipe(
      //   concat(of({ type: types.navigation.triggered, payload: ROUTES.STAKEING })),
      //   concat(of({ type: types.navigation.triggered, payload: ROUTES.STAKEING.OVERVIEW }))
      // );
    })
  );

const sendStakingExtrinsicEpic = action$ =>
  action$.pipe(
    ofType(types.nodeStateChange.triggered),
    withLatestFrom(types.sendStakingExtrinsic.triggered),
    mergeMap(async ([state, payload]) => {
      console.log('sendStakingExtrinsicEpic payload', payload);
      console.log('sendStakingExtrinsicEpic state', state);

      if (state.payload && state.payload.state === 'running' && payload) {
        const { wallet, stashAccountAddress, passphrase } = payload;
        const txHash = await window.odin.api.cennz.doStake(wallet, stashAccountAddress, passphrase);

        assert(txHash, 'failed to get staking txHash');
      }
    })
  );

export default [triggerStakingEpic, sendStakingExtrinsicEpic];
