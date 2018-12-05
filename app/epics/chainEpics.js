import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';

export default (fromType, toType, payload) => action$ =>
  fromType.constructor === Function
    ? fromType(action$)
    : action$.pipe(
        ofType(fromType),
        mergeMap(({ payload: prevPayload }) =>
          of({
            type: toType,
            payload:
              payload !== undefined
                ? payload.constructor === Function
                  ? payload(prevPayload)
                  : payload
                : prevPayload,
          })
        )
      );
