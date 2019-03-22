import { EMPTY, from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import history from 'renderer/history';
import types from 'renderer/types';
import { Logger } from 'renderer/utils/logging';

const navigationEpic = action$ =>
  action$.pipe(
    ofType(types.navigation.triggered),
    mergeMap(({ payload }) => {
      Logger.debug(`navigationEpic, payload: ${JSON.stringify(payload)}`);
      history.push(payload);
      return EMPTY;
    })
  );

export default navigationEpic;
