// @flow
const store = global.electronStore;

type StorageKeys = {
  TERMS_OF_USE_ACCEPTANCE: string,
  SELECTED_NETWORK: string,
};

const storageKeys = {
  TERMS_OF_USE_ACCEPTANCE: 'TERMS_OF_USE_ACCEPTANCE',
  SELECTED_NETWORK: 'SELECTED_NETWORK',
  REMEMBER_SELECTED_NETWORK: 'REMEMBER_SELECTED_NETWORK',
  LOCAL_FILE_PATH: 'LOCAL_FILE_PATH',
  UPLOADED_FILE_INFO: ' UPLOADED_FILE_INFO',
};

export const getTermsOfUseAcceptance = (): Promise<boolean> =>
  new Promise((resolve, reject) => {
    try {
      const Acceptance = store.get(storageKeys.TERMS_OF_USE_ACCEPTANCE);
      if (!Acceptance) return resolve(false);
      resolve(Acceptance);
    } catch (error) {
      return reject(error);
    }
  });

export const setTermsOfUseAcceptance = (): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      store.set(storageKeys.TERMS_OF_USE_ACCEPTANCE, true);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });

export const unsetTermsOfUseAcceptance = (): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      store.delete(storageKeys.TERMS_OF_USE_ACCEPTANCE);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });

export const getRememberSelectedNetwork = (): Promise<boolean> =>
  new Promise((resolve, reject) => {
    try {
      const Acceptance = store.get(storageKeys.REMEMBER_SELECTED_NETWORK);
      console.log('Acceptance', Acceptance);
      if (typeof Acceptance === 'undefined') {
        resolve(true);
      }

      resolve(Acceptance);
    } catch (error) {
      return reject(error);
    }
  });

export const setRememberSelectedNetwork = (ifRemember: boolean): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      store.set(storageKeys.REMEMBER_SELECTED_NETWORK, ifRemember);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });

export const unsetRememberSelectedNetwork = (): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      store.delete(storageKeys.REMEMBER_SELECTED_NETWORK);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });

export const getSelectedNetwork = (): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const selectedNetwork = store.get(storageKeys.SELECTED_NETWORK);
      if (!selectedNetwork) return resolve('');
      resolve(selectedNetwork);
    } catch (error) {
      return reject(error);
    }
  });

export const setSelectedNetwork = (payload: string): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      store.set(storageKeys.SELECTED_NETWORK, payload);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });

export const unsetSelectedNetwork = (): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      store.delete(storageKeys.SELECTED_NETWORK);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });

export const getUploadedFileInfo = (): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const uploadedFileInfo = store.get(storageKeys.UPLOADED_FILE_INFO);
      console.log('****uploadedFileInfoInstore', uploadedFileInfo);
      if (!uploadedFileInfo) return resolve('');
      resolve(uploadedFileInfo);
    } catch (error) {
      return reject(error);
    }
  });

export const setUploadedFileInfo = (payload: string): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      store.set(storageKeys.UPLOADED_FILE_INFO, payload);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });

export const unsetUploadedFileInfo = (): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      store.delete(storageKeys.UPLOADED_FILE_INFO);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });

export const reset = async () => {
  await unsetTermsOfUseAcceptance();
  await unsetRememberSelectedNetwork();
  await unsetSelectedNetwork();
  await unsetUploadedFileInfo();
};
