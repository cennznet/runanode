// @flow
const store = global.electronStore;

type StorageKeys = {
  TERMS_OF_USE_ACCEPTANCE: string,
};

export default class Storage {
  storageKeys: StorageKeys;

  constructor() {
    this.storageKeys = {
      TERMS_OF_USE_ACCEPTANCE: 'TERMS_OF_USE_ACCEPTANCE',
    };
  }

  getTermsOfUseAcceptance = (): Promise<boolean> =>
    new Promise((resolve, reject) => {
      try {
        const Acceptance = store.get(this.storageKeys.TERMS_OF_USE_ACCEPTANCE);
        if (!Acceptance) return resolve(false);
        resolve(Acceptance);
      } catch (error) {
        return reject(error);
      }
    });

  setTermsOfUseAcceptance = (): Promise<void> =>
    new Promise((resolve, reject) => {
      try {
        store.set(this.storageKeys.TERMS_OF_USE_ACCEPTANCE, true);
        resolve();
      } catch (error) {
        return reject(error);
      }
    });

  unsetTermsOfUseAcceptance = (): Promise<void> =>
    new Promise((resolve, reject) => {
      try {
        store.delete(this.storageKeys.TERMS_OF_USE_ACCEPTANCE);
        resolve();
      } catch (error) {
        return reject(error);
      }
    });

  reset = async () => {
    await this.unsetTermsOfUseAcceptance();
  };
}
