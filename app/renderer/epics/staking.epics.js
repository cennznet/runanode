import { EMPTY, of } from 'rxjs';
import { mergeMap, map, takeUntil, withLatestFrom, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ofType } from 'redux-observable';
import assert from 'assert';
import R from 'ramda';
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

      return { type: types.sendStakingExtrinsic.triggered, payload };

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
    // ofType(types.sendStakingExtrinsic.triggered),
    // mergeMap(async ({ payload }) => {
    ofType(types.nodeStateChange.triggered),
    withLatestFrom(action$.ofType(types.sendStakingExtrinsic.triggered)),
    mergeMap(async ([nodeStateChangeAction, sendStakingExtrinsicAction]) => {
      if (
        nodeStateChangeAction.payload === 'running' &&
        R.has('wallet')(sendStakingExtrinsicAction.payload)
      ) {
        // if (payload) {
        const { wallet, stashAccountAddress, passphrase } = sendStakingExtrinsicAction.payload;
        const extrinsicHash = await window.odin.api.cennz.doStake(
          wallet,
          stashAccountAddress,
          passphrase
        );
        assert(extrinsicHash, 'Failed to get staking extrinsicHash');

        return {
          type: types.subscribeExtrinsicStatus.triggered,
          payload: {
            extrinsicHash,
            type: 'STAKING',
          },
        };
      }

      return { type: '' };
    }),
    catchError(err => {
      return of({
        type: types.errorToaster.triggered,
        payload:
          err instanceof assert.AssertionError ? err.message : 'Failed to send staking extrinsic',
      });
    })
  );
const watchExtrinsicEpic = action$ =>
  action$.pipe(
    ofType(types.subscribeExtrinsicStatus.triggered),
    mergeMap(({ payload: { extrinsicHash } }) => {
      assert(extrinsicHash, 'failed to get staking extrinsicHash');

      return Observable.create(observer => {
        window.odin.api.cennz.api.rpc.author.submitAndWatchExtrinsic(extrinsicHash, status => {
          observer.next(status);
        });
      }).pipe(
        map(status => {
          return EMPTY;
        })
      );
    }),
    takeUntil(action$.ofType(types.unsubscribeExtrinsicStatus.triggered))
  );

export default [triggerStakingEpic, sendStakingExtrinsicEpic, watchExtrinsicEpic];
