// @flow
const store = global.electronStore;

export const storageKeys = {
  ENABLE_ANALYTICS: 'ENABLE_ANALYTICS',
  GENESIS_CONFIG_FILE_INFO: ' GENESIS_CONFIG_FILE_INFO',
  REMEMBER_NETWORK: 'REMEMBER_NETWORK',
  SELECTED_NETWORK: 'SELECTED_NETWORK',
  STAKING_STASH_ACCOUNT_ADDRESS: 'STAKING_STASH_ACCOUNT_ADDRESS',
  STAKING_STASH_WALLET_ID: 'STAKING_STASH_WALLET_ID',
  TERMS_OF_USE_ACCEPTANCE: 'TERMS_OF_USE_ACCEPTANCE',
  WALLETS: 'WALLETS',
  STAKING_PREFERENCE: 'STAKING_PREFERENCE',
  // TODO any new storage key need to update localStorage.epics.js resetLocalStorageEpic and init.epic.js initEpic, this could be done automatically
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
