import { EMPTY, from, of, empty } from 'rxjs';
import { ofType } from 'redux-observable';
import { Wallet } from 'cennznet-wallet';
import { mergeMap } from "rxjs/operators";

import types from '../types';
import { CennzNetNodeStates } from '../../common/types/cennznet-node.types';
import { environment } from '../../common/environment';

const { isDev } = environment;

const getTosterType = state => {
  if (state === CennzNetNodeStates.RUNNING) {
    return types.successToaster.triggered;
  }
  if (state === CennzNetNodeStates.CRASHED ||
    state === CennzNetNodeStates.ERRORED ||
    state === CennzNetNodeStates.UNRECOVERABLE
  ) {
    return types.errorToaster.triggered;
  }
  return types.warningToaster.triggered
}

const chainToasterAfterNetworkStateChangeEpic = action$ =>
  action$.pipe(
    ofType(types.networkStateChange.triggered),
    mergeMap(({payload}) => {
      if(isDev) {
        return of(
          {
            type: getTosterType(payload),
            payload: `Node state changed: ${JSON.stringify(payload)}`,
          }
        );
      }
    })
  );

export default [chainToasterAfterNetworkStateChangeEpic];
