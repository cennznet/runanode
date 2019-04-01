import { EMPTY, of, from, throwError } from 'rxjs';
import {
  concat,
  map,
  mergeMap,
  withLatestFrom,
  combineLatest,
  catchError,
  filter,
  mapTo,
} from 'rxjs/operators';
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

      const seed = await window.appApi.getSeedFromWalletAccount(
        wallet,
        stashAccountAddress,
        passphrase
      );

      assert(seed, 'fail to get seed from wallet account');

      await restartCennzNetNodeChannel.send({ key: seed, isValidatorMode: true });

      Logger.debug(`startToStakeEpic types.pendingToSendStakingExtrinsic.triggered`);
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

const errorFn = err => {
  Logger.debug(`errorFn, err: ${err}`);
  if (err) {
    return of(
      {
        type: types.errorToaster.triggered,
        payload: err.message ? err.message : err,
      },
      { type: types.resetAppUiState.triggered }
    );
  }
  return EMPTY;
};

const sendStakingExtrinsicEpic = action$ =>
  action$.pipe(
    ofType(types.nodeStateChange.triggered),
    withLatestFrom(action$.ofType(types.pendingToSendStakingExtrinsic.triggered)),
    mergeMap(([nodeStateChangeAction, pendingToSendStakingExtrinsicAction]) => {
      Logger.debug(`sendStakingExtrinsicEpic, doStake`);
      if (
        nodeStateChangeAction.payload === 'running' &&
        R.has('wallet')(pendingToSendStakingExtrinsicAction.payload) &&
        R.has('stashAccountAddress')(pendingToSendStakingExtrinsicAction.payload)
      ) {
        Logger.debug(`sendStakingExtrinsicEpic, doStake`);
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
          };
          try {
            const unsubscribeFn = await window.appApi.doStake(
              wallet,
              stashAccountAddress,
              balances,
              stakingPreference,
              passphrase,
              statusCb
            );
            Logger.debug(`sendStakingExtrinsicEpic, unsubscribeFn: ${unsubscribeFn}`);
          } catch (err) {
            Logger.debug(`sendStakingExtrinsicEpic, err: ${err}`);
            observer.error('Failed to send staking extrinsic');
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
          }),
          catchError(errorFn)
        );
      }
      return of({ type: '' });
    }),
    catchError(errorFn)
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
            { type: types.resetAppUiState.triggered },
            { type: types.sendNodeStatusToIpcMain.requested, payload: { isStaking: true } }
          )
        ),
        concat(
          of({
            type: types.successToaster.triggered,
            payload: {
              message:
                'Your stake has been successfully submitted to network. Before your stake goes to validator list, you can unstake without account being locked.',
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

const unStakeEpic = action$ =>
  action$.pipe(
    ofType(types.unStake.triggered),
    mergeMap(({ payload }) => {
      Logger.debug(`unStakeEpic payload: ${JSON.stringify(payload)}`);
      const { wallet, stashAccountAddress, passphrase } = payload;
      return new Observable(async observer => {
        const statusCb = ({ events, status, type }) => {
          Logger.debug(`unStakeEpic events: ${events}, status: ${status}, type: ${type}`);
          observer.next(type);
          if (type === 'Finalised') {
            observer.complete();
          }
        };
        try {
          const unsubscribeFn = await window.appApi.doUnStake(
            wallet,
            stashAccountAddress,
            passphrase,
            statusCb
          );

          Logger.debug(`unStakeEpic, unsubscribeFn: ${unsubscribeFn}`);
        } catch (err) {
          Logger.debug(`unStakeEpic, err: ${err}`);
          observer.error('Failed to send unstake extrinsic');
        }
      }).pipe(
        map(type => {
          Logger.debug(`unStakeEpic pipe, type: ${type}`);
          if (type === 'Finalised') {
            return {
              type: types.unStakeExtrinsicCompleted.triggered,
              payload: {
                wallet,
                stashAccountAddress,
              },
            };
          }
          return { type: '' };
        }),
        catchError(errorFn)
      );
    }),
    catchError(errorFn)
  );

const sendUnStakeTxCompletedEpic = action$ =>
  action$.pipe(
    ofType(types.unStakeExtrinsicCompleted.triggered),
    mergeMap(({ payload: { wallet, stashAccountAddress } }) => {
      return of(
        {
          type: types.clearStorage.requested,
          payload: {
            key: storageKeys.STAKING_STASH_ACCOUNT_ADDRESS,
          },
        },
        {
          type: types.clearStorage.requested,
          payload: {
            key: storageKeys.STAKING_STASH_WALLET_ID,
          },
        }
      ).pipe(
        concat(
          of(
            {
              type: types.successToaster.triggered,
              payload: {
                message: 'Your unstake request is successfully submitted to network.',
                options: {
                  autoClose: 12000,
                },
              },
            },
            { type: types.navigation.triggered, payload: ROUTES.STAKING.OVERVIEW },
            { type: types.resetAppUiState.triggered }
          )
        )
      );
    })
  );

const chainSendUnStakeTxToChangeUistatus = chainEpics(
  types.unStake.triggered,
  types.changeAppUiState.triggered,
  {
    isProcessing: true,
    message: 'Sending unstake request...',
  }
);

export default [
  startToStakeEpic,
  chainSendStakingTxToChangeUistatus,
  sendStakingExtrinsicEpic,
  sendStakingTxCompletedEpic,
  stakingSavePreferenceEpic,
  stakingSavePreferenceCompletedEpic,
  unStakeEpic,
  sendUnStakeTxCompletedEpic,
  chainSendUnStakeTxToChangeUistatus,
];
