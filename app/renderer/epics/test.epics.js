import { EMPTY, from, of } from 'rxjs';
import { concat, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Wallet } from 'cennznet-wallet';

import types from '../types';
import { getStorage, storageKeys } from '../api/utils/storage';

const testPageEpic = action$ =>
  action$.pipe(
    ofType(types.testPage.triggered),
    mergeMap(() => EMPTY)
  );

export default [testPageEpic];
