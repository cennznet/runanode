import { EMPTY, from, of, zip } from 'rxjs';
import { mergeMap, map, concat, tap, mapTo, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import assert from 'assert';

import types from 'renderer/types';
import chainEpics from 'renderer/epics/chainEpics';
import streamConstants from 'renderer/constants/stream';
import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import { Logger } from 'renderer/utils/logging';

const stakingRestartNodeWithNetworkChain = chainEpics(
  types.stakeAndRestartNode.triggered,
  types.stakingRestartNode.requested,
  payload => payload
);

const stakingRestartNodeEpic = action$ =>
  action$.pipe(
    ofType(types.stakingRestartNode.requested),
    tap(async ({ payload }) => {
      const { wallet, stashAccountAddress, isValidatorMode = false, passphrase } = payload;

      const txHash = await window.odin.api.cennz.doStake(wallet, stashAccountAddress, passphrase);

      assert(txHash, 'failed to get staking txHash');

      const seed = await window.odin.api.cennz.getSeedFromWalletAccount(
        wallet,
        stashAccountAddress,
        passphrase
      );

      assert(seed, 'fail to get seed from wallet account');

      const cennzNetRestartOptions = {
        key: seed,
        isValidatorMode,
      };

      restartCennzNetNodeChannel.send(cennzNetRestartOptions);
    }),
    mergeMap(() =>
      of(
        // {
        //   type: types.nodeWsSystemChainPolling.requested,
        // },
        {
          type: types.stakingRestartNode.completed,
        }
      )
    )
  );

export default [stakingRestartNodeWithNetworkChain, stakingRestartNodeEpic];
