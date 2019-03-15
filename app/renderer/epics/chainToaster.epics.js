import { EMPTY, from, of, empty } from 'rxjs';
import { ofType } from 'redux-observable';
import { Wallet } from '@cennznet/wallet';
import { mergeMap } from 'rxjs/operators';

import { CennzNetNodeStates } from 'common/types/cennznet-node.types';
import { environment } from 'common/environment';
import types from '../types';
import chainEpics from './chainEpics';

const { isDev } = environment;

const getTosterType = state => {
  if (state === CennzNetNodeStates.RUNNING) {
    return types.successToaster.triggered;
  }
  if (
    state === CennzNetNodeStates.CRASHED ||
    state === CennzNetNodeStates.ERRORED ||
    state === CennzNetNodeStates.UNRECOVERABLE
  ) {
    return types.errorToaster.triggered;
  }
  return types.warningToaster.triggered;
};

const chainToasterAfterNodeStateChangeEpic = action$ =>
  action$.pipe(
    ofType(types.nodeStateChange.triggered),
    mergeMap(({ payload }) => {
      if (isDev) {
        return of({
          type: getTosterType(payload),
          payload: `Node is ${payload}`,
        });
      }
    })
  );

const chainToasterAfterSavePreferencesCompletedEpic = chainEpics(
  types.stakingSavePreferences.completed,
  types.successToaster.triggered,
  payload => {

    // TODD how to format tx in toaster?
    const children = payload.toString();
    const substrLength = 12;
    const formattedText =
      children.length > 17
        ? children.substr(0, substrLength) +
        ' ... ' +
        children.substr(children.length - 5, children.length)
        : children;
    return `Preference saved. ${formattedText}`;
  },
);

const chainToasterAfterSavePreferencesFailedEpic = chainEpics(
  types.stakingSavePreferences.failed,
  types.errorToaster.triggered,
  payload => {
    return `Failed to save preference.`;
  },
);

export default [
  chainToasterAfterNodeStateChangeEpic,
  chainToasterAfterSavePreferencesCompletedEpic,
  chainToasterAfterSavePreferencesFailedEpic,
];
