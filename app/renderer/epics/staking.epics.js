import { EMPTY, from, of, zip } from 'rxjs';
import { mergeMap, map, concat, tap, mapTo, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import assert from 'assert';

import types from 'renderer/types';
import chainEpics from 'renderer/epics/chainEpics';
import streamConstants from 'renderer/constants/stream';
import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import { Logger } from 'renderer/utils/logging';


const stakingAndRestartNodeChain = chainEpics(
  types.stakeAndRestartNode.triggered,
  types.stakingStopStream.requested,
  payload => payload
);

const stakingStopStreamEpic = action$ =>
  action$.pipe(
    ofType(types.stakingStopStream.requested),
    mergeMap(({ payload }) => {
      return of(
        {
          type: types.syncStream.requested,
          payload: { command: streamConstants.DISCONNECT },
        },
        {
          type: types.syncRemoteStream.requested,
          payload: { command: streamConstants.DISCONNECT },
        },
        {
          type: types.stakingStopStream.completed,
          payload,
        }
      );
    })
  );

const stakingRestartNodeWithNetworkChain = chainEpics(
  types.stakingStopStream.completed,
  types.stakingRestartNode.requested,
  payload => payload
);

const stakingRestartNodeEpic = action$ =>
  action$.pipe(
    ofType(types.stakingRestartNode.requested),
    tap( async ({ payload }) => {
      const { cennzNetRestartOptions, wallet, fromAddress } = payload;

      // send staking extrinsic
      const txHash = await window.odin.api.cennz.doStake(wallet, fromAddress, '');
      Logger.debug(`txHash: ${txHash}`);
      assert(txHash, 'missing txHash');

      // retreat wallet seed
      const seed = await window.odin.api.cennz.getSeedFromWalletAccount(wallet, fromAddress, '');
      assert(seed, 'fail to getSeedFromWalletAccount');
      cennzNetRestartOptions.key = seed;

      // restart node in validator mode
      restartCennzNetNodeChannel.send(cennzNetRestartOptions);
    }),
    mergeMap(() =>
      of(
        {
          type: types.syncStream.requested,
          payload: { command: streamConstants.CONNECT },
        },
        {
          type: types.syncRemoteStream.requested,
          payload: { command: streamConstants.CONNECT },
        },
        {
          type: types.nodeWsSystemChainPolling.requested,
        },
        {
          type: types.stakingRestartNode.completed,
        }
      )
    )
  );

const stakingSavePreferenceEpic = action$ =>
  action$.pipe(
    ofType(types.stakingSavePreferences.requested),
    mergeMap(async ({ payload }) => {
      Logger.debug(`stakingSavePreferenceEpic: ${JSON.stringify(payload)}`);
      const intentionIndex = await window.odin.api.cennz.getIntentionIndex(payload.address);
      Logger.debug(`intentionIndex: ${intentionIndex}`);
      if(intentionIndex > 0) {
        const { wallet, address } = payload.wallet;
        const prefs = {
          unstakeThreshold: payload.unStakeThreshold,
          validatorPayment: payload.paymentPreferences,
        };
        const txHash = await window.odin.api.cennz.saveStakingPreferences(
          wallet,
          prefs,
          address,
        );
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



// const chainToasterAfterRestartNodeEpic = chainEpics(
//   types.stakingRestartNode.completed,
//   types.successToaster.triggered,
//   'Wallet has been connected.'
// );

export default [
  stakingAndRestartNodeChain,
  stakingStopStreamEpic,
  stakingRestartNodeWithNetworkChain,
  stakingRestartNodeEpic,
  stakingSavePreferenceEpic,
  // chainToasterAfterRestartNodeEpic,
];
