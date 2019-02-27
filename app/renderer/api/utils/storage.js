// @flow
const store = global.electronStore;

export const storageKeys = {
  ENABLE_ANALYTICS: 'ENABLE_ANALYTICS',
  GENESIS_CONFIG_FILE_INFO: ' GENESIS_CONFIG_FILE_INFO',
  REMEMBER_NETWORK: 'REMEMBER_NETWORK',
  SELECTED_NETWORK: 'SELECTED_NETWORK',
  TERMS_OF_USE_ACCEPTANCE: 'TERMS_OF_USE_ACCEPTANCE',
  WALLETS: 'WALLETS',
};

export const getStorage = (key: string): Promise<any> =>
  new Promise((resolve, reject) => {
    try {
      const value = store.get(key);
      resolve(typeof value === 'undefined' ? null : value);
    } catch (error) {
      return reject(error);
    }
  });

export const setStorage = (key: string, value: any): Promise<any> =>
  new Promise((resolve, reject) => {
    try {
      store.set(key, value);
      const val = store.get(key);
      resolve(typeof val === 'undefined' ? null : val);
    } catch (error) {
      return reject(error);
    }
  });

export const clearStorage = (key: string): Promise<any> =>
  new Promise((resolve, reject) => {
    try {
      store.delete(key);
      resolve(null);
    } catch (error) {
      return reject(error);
    }
  });
