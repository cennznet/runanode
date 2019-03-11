import { EMPTY, of, from } from 'rxjs';
import { concat, mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import assert from 'assert';
import R from 'ramda';
import { storageKeys } from 'renderer/api/utils/storage';
import types from 'renderer/types';
import chainEpics from 'renderer/epics/chainEpics';
import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import { Logger } from 'renderer/utils/logging';
import ROUTES from 'renderer/constants/routes';

const startToStakeEpic = action$ =>
  action$.pipe(
    ofType(types.stake.triggered),
    mergeMap(async ({ payload }) => {
      const { wallet, stashAccountAddress, passphrase } = payload;

      const seed = await window.odin.api.cennz.getSeedFromWalletAccount(
        wallet,
        stashAccountAddress,
        passphrase
      );

      assert(seed, 'fail to get seed from wallet account');

      await restartCennzNetNodeChannel.send({ key: seed, isValidatorMode: true });

      return { type: types.pendingToSendStakingExtrinsic.triggered, payload };
    }),
    // TODO: Extract it to be reusable
    catchError(err => {
      if (err) {
        return of({
          type: types.errorToaster.triggered,
          payload:
            err instanceof assert.AssertionError ? err.message : 'Failed to send staking extrinsic',
        });
      }
      return EMPTY;
    })
  );

const chainSendStakingTxToChangeUistatus = chainEpics(
  types.stake.triggered,
  types.changeAppUiState.triggered,
  {
    isProcessing: true,
    message: 'Sending staking request...',
  }
);

const sendStakingExtrinsicEpic = action$ =>
  action$.pipe(
    ofType(types.nodeStateChange.triggered),
    withLatestFrom(action$.ofType(types.pendingToSendStakingExtrinsic.triggered)),
    mergeMap(([nodeStateChangeAction, pendingToSendStakingExtrinsicAction]) => {
      if (
        nodeStateChangeAction.payload === 'running' &&
        R.has('wallet')(pendingToSendStakingExtrinsicAction.payload) &&
        R.has('stashAccountAddress')(pendingToSendStakingExtrinsicAction.payload)
      ) {
        const {
          wallet,
          stashAccountAddress,
          passphrase,
        } = pendingToSendStakingExtrinsicAction.payload;

        return from(window.odin.api.cennz.doStake(wallet, stashAccountAddress, passphrase)).pipe(
          mergeMap(extrinsicHash => {
            assert(extrinsicHash, 'Failed to get staking extrinsicHash');

            return of({
                type: types.setStorage.requested,
                payload: {
                  key: storageKeys.STAKING_STASH_ACCOUNT_ADDRESS,
                  value: stashAccountAddress,
                },
              },
              {
                type: types.setStorage.requested,
                payload: {
                  key: storageKeys.STAKING_STASH_WALLET_ID,
                  value: wallet.id,
                },
              },
            ).pipe(
              concat(of({ type: types.navigation.triggered, payload: ROUTES.STAKING.OVERVIEW })),
              concat(of({ type: types.resetAppUiState.triggered })),
              concat(
                of({
                  type: types.successToaster.triggered,
                  payload: {
                    message:
                      'Your stake is successfully submitted to network. Before your stake goes to validator list, you can unstake without account being locked.',
                    options: {
                      autoClose: 12000,
                    },
                  },
                }),
              ),
            );
          }),
        );
      }

      return of({ type: '' });
    }),
    catchError(err => {
      if (err) {
        return of({
          type: types.errorToaster.triggered,
          payload:
            err instanceof assert.AssertionError ? err.message : 'Failed to send staking extrinsic',
        });
      }
      return EMPTY;
    })
  );

const stakingSavePreferenceEpic = action$ =>
  action$.pipe(
    ofType(types.stakingSavePreferences.requested),
    mergeMap(async ({ payload }) => {
      Logger.debug(`stakingSavePreferenceEpic: ${JSON.stringify(payload)}`);
      const intentionIndex = await window.odin.api.cennz.getIntentionIndex(payload.address);
      Logger.debug(`intentionIndex: ${intentionIndex}`);
      if (intentionIndex > 0) {
        const { wallet, address } = payload;
        const prefs = {
          unstakeThreshold: payload.unStakeThreshold,
          validatorPayment: payload.paymentPreferences,
        };
        const txHash = await window.odin.api.cennz.saveStakingPreferences(wallet, prefs, address);
        Logger.debug(`txHash: ${txHash}`);
        assert(txHash, 'missing txHash');
        return {
          type: types.stakingSavePreferences.completed,
          payload: txHash,
        };
      }
      return { type: types.stakingSavePreferences.failed };
    })
  );

export default [
  startToStakeEpic,
  chainSendStakingTxToChangeUistatus,
  sendStakingExtrinsicEpic,
  stakingSavePreferenceEpic,
];
