import { EMPTY, of, from } from 'rxjs';
import { concat, map, mergeMap, withLatestFrom, catchError, filter, mapTo } from 'rxjs/operators';
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
          stakingPreference,
          balances,
        } = pendingToSendStakingExtrinsicAction.payload;

        return new Observable(async observer => {
          const statusCb = ({ events, status, type }) => {
            Logger.debug(`sendStakingExtrinsicEpic status: ${status}`);
            observer.next(type);
            if (type === 'Finalised') {
              observer.complete();
            }
          }
          const unsubscribeFn = await window.odin.api.cennz.doStake(wallet, stashAccountAddress, balances, stakingPreference, passphrase, statusCb);
          Logger.debug(`sendStakingExtrinsicEpic, unsubscribeFn: ${unsubscribeFn}`);
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
      Logger.debug(`stakingSavePreferenceEpic, payload: ${JSON.stringify(payload)}`);
      const { wallet, address } = payload;
      const prefs = {
        unstakeThreshold: payload.unStakeThreshold,
        validatorPayment: payload.paymentPreferences,
      };
      Logger.debug(`stakingSavePreferenceEpic, prefs: ${JSON.stringify(prefs)}`);
      return {
        type: types.setStorage.requested,
        payload: { key: storageKeys.STAKING_PREFERENCE, value: prefs },
      };
    })
  );

const stakingSavePreferenceCompletedEpic = action$ =>
  action$.ofType(types.setStorage.completed).pipe(
    filter(({ payload }) => payload.key === storageKeys.STAKING_PREFERENCE),
    mapTo({
      type: types.stakingSavePreferences.completed,
    })
  );

export default [
  startToStakeEpic,
  chainSendStakingTxToChangeUistatus,
  sendStakingExtrinsicEpic,
  sendStakingTxCompletedEpic,
  stakingSavePreferenceEpic,
  stakingSavePreferenceCompletedEpic,
];
