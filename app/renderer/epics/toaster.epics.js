import { EMPTY, from, of, empty } from 'rxjs';
import { concat, mergeMap, mapTo, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Wallet } from 'cennznet-wallet';
import { toast, ToastContainer } from 'react-toastify';
import { setToaster } from '../components/Toaster/utils/toast';
import types from '../types';
import { getStorage, storageKeys } from '../api/utils/storage';
import { Logger } from '../utils/logging';

const successToasterEpic = action$ =>
  action$.pipe(
    ofType(types.successToaster.triggered),
    mergeMap(({ payload }) => {
      setToaster('success', payload);
      return EMPTY;
    })
  );

const errorToasterEpic = action$ =>
  action$.pipe(
    ofType(types.errorToaster.triggered),
    mergeMap(({ payload }) => {
      setToaster('error', payload);
      return EMPTY;
    })
  );

const warningToasterEpic = action$ =>
  action$.pipe(
    ofType(types.warningToaster.triggered),
    mergeMap(({ payload }) => {
      setToaster('warning', payload);
      return EMPTY;
    })
  );

const infoToasterEpic = action$ =>
  action$.pipe(
    ofType(types.infoToaster.triggered),
    mergeMap(({ payload }) => {
      setToaster('info', payload);
      return EMPTY;
    })
  );

export default [successToasterEpic, errorToasterEpic, warningToasterEpic, infoToasterEpic];
