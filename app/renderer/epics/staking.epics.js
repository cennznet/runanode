import { EMPTY, of, from } from 'rxjs';
import { concat, map, mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
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

        return new Observable(async observer => {
          const txHash = await window.odin.api.cennz.doStake(wallet, stashAccountAddress, passphrase);
          Logger.debug(`sendStakingExtrinsicEpic, txHash: ${txHash}`);
          if(txHash) {
            observer.next('Finalised');
            observer.complete();
          } else {
            // TODO error handling
          }
        }).pipe(
          map(type => {
            Logger.debug(`sendStakingExtrinsicEpic, type: ${type}`);
            if (type === 'Finalised') {
              return {
                type: types.stakingExtrinsicCompleted.triggered,
                payload: {
                  wallet,
                  stashAccountAddress,
                },
              };
            }
            return { type: '' };
          })
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

const sendStakingTxCompletedEpic = action$ =>
  action$.pipe(
    ofType(types.stakingExtrinsicCompleted.triggered),
    mergeMap(({ payload: { wallet, stashAccountAddress } }) => {
      return of(
        {
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
        }
      ).pipe(
        concat(
          of(
            // Call the action with empty payload to avoid accident excuting when users change network while staking
            { type: types.pendingToSendStakingExtrinsic.triggered, payload: {} },
            { type: types.navigation.triggered, payload: ROUTES.STAKING.OVERVIEW },
            { type: types.resetAppUiState.triggered }
          )
        ),
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
          })
        )
      );
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
  sendStakingTxCompletedEpic,
  stakingSavePreferenceEpic,
];
