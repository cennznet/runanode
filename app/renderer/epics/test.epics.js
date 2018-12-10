import { EMPTY, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import types from 'renderer/types';

const testPageEpic = action$ =>
  action$.pipe(
    ofType(types.testPage.triggered),
    mergeMap(() => {
      return EMPTY;
    })
  );

export default [testPageEpic];
