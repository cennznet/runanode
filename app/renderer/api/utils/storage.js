// @flow
const store = global.electronStore;

type StorageKeys = {
  TERMS_OF_USE_ACCEPTANCE: string,
  SELECTED_NETWORK: string,
};

const storageKeys = {
  TERMS_OF_USE_ACCEPTANCE: 'TERMS_OF_USE_ACCEPTANCE',
  SELECTED_NETWORK: 'SELECTED_NETWORK',
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

export const reset = async () => {
  await unsetTermsOfUseAcceptance();
};

/** Sync Node */
export const getSelectedNetwork = (): Promise<boolean> =>
  new Promise((resolve, reject) => {
    try {
      const selectedNetwork = store.get(storageKeys.SELECTED_NETWORK);
      if (!selectedNetwork) return resolve(null);
      resolve(selectedNetwork);
    } catch (error) {
      return reject(error);
    }
  });

export const setSelectedNetwork = (payload): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      store.set(storageKeys.SELECTED_NETWORK, payload);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });
