import { EMPTY, from, of, empty } from 'rxjs';
import { concat, mergeMap, mapTo, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Wallet } from 'cennznet-wallet';
import { toast, ToastContainer } from 'react-toastify';
import { successToast } from '../components/Toaster/utils/toast';
import types from '../types';
import { getStorage, storageKeys } from '../api/utils/storage';
import { Logger } from '../utils/logging';

const successToasterEpic = action$ =>
  action$.pipe(
    ofType(types.successToaster.triggered),
    mergeMap(({ payload }) => {
      successToast(payload);
      return EMPTY;
    })
  );

export default [successToasterEpic];
