// @flow
const store = global.electronStore;

type StorageKeys = {
  TERMS_OF_USE_ACCEPTANCE: string,
};

const storageKeys = {
  TERMS_OF_USE_ACCEPTANCE: 'TERMS_OF_USE_ACCEPTANCE',
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
