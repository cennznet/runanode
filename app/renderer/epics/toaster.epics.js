import { EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import R from 'ramda';
import toast from 'components/Toaster/toast';
import types from '../types';

const triggerToaster = (type, payload) => {
  toast(type, R.propOr(payload, 'message')(payload), R.propOr({}, 'options')(payload));
};

const successToasterEpic = action$ =>
  action$.pipe(
    ofType(types.successToaster.triggered),
    mergeMap(({ payload }) => {
      triggerToaster('success', payload);
      return EMPTY;
    })
  );

const errorToasterEpic = action$ =>
  action$.pipe(
    ofType(types.errorToaster.triggered),
    mergeMap(({ payload }) => {
      triggerToaster('error', payload);
      return EMPTY;
    })
  );

const warningToasterEpic = action$ =>
  action$.pipe(
    ofType(types.warningToaster.triggered),
    mergeMap(({ payload }) => {
      triggerToaster('warning', payload);
      return EMPTY;
    })
  );

const infoToasterEpic = action$ =>
  action$.pipe(
    ofType(types.infoToaster.triggered),
    mergeMap(({ payload }) => {
      triggerToaster('info', payload);
      return EMPTY;
    })
  );

export default [successToasterEpic, errorToasterEpic, warningToasterEpic, infoToasterEpic];
