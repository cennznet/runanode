import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';

const chainEpics = (fromType, to, payload) => (action$) => {
  if (fromType == null || to == null) {
    throw new Error('Invalid Argument');
  }
  const from = typeof fromType === 'function' ? fromType(action$) : action$.pipe(ofType(fromType));
  return from.pipe(map(({ payload: prevPayload, meta, error }) => {
    let newPayload;
    if (payload == null) {
      newPayload = prevPayload;
    } else if (typeof payload === 'function') {
      newPayload = payload(prevPayload, meta, error);
    } else {
      newPayload = payload;
    }
    if (typeof to === 'string') {
      return {
        type: to,
        meta,
        payload: newPayload
      };
    }
    return to;
  }));
};

export default chainEpics;
