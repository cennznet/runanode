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
    tap(async ({ payload }) => {
      const { wallet, stashAccountAddress, isValidatorMode = false } = payload;

      const txHash = await window.odin.api.cennz.doStake(wallet, stashAccountAddress, '');
      Logger.debug(`txHash: ${txHash}`);
      assert(txHash, 'missing txHash');

      const seed = await window.odin.api.cennz.getSeedFromWalletAccount(
        wallet,
        stashAccountAddress,
        ''
      );

      assert(seed, 'fail to getSeedFromWalletAccount');

      const cennzNetRestartOptions = {
        key: seed,
        isValidatorMode,
      };

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

export default [
  stakingAndRestartNodeChain,
  stakingStopStreamEpic,
  stakingRestartNodeWithNetworkChain,
  stakingRestartNodeEpic,
];
