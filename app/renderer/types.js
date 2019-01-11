const apiActionTypes = name => {
  const prefix = name.toUpperCase();
  return {
    requested: `${prefix}_REQUESTED`,
    completed: `${prefix}_COMPLETED`,
    failed: `${prefix}_FAILED`,
    cancelled: `${prefix}_CANCELLED`,
  };
};

const changedActionTypes = name => {
  const prefix = name.toUpperCase();
  return {
    changeRequested: `${prefix}_CHANGE_REQUESTED`,
    changed: `${prefix}_CHANGED`,
  };
};

const triggerActionTypes = name => {
  const prefix = name.toUpperCase();
  return {
    triggered: `${prefix}_TRIGGERED`,
  };
};

const actionTypes = {
  testPage: triggerActionTypes('test_page'),
  homePageLoad: triggerActionTypes('home_page_load'),
  walletRestorePageLoad: triggerActionTypes('wallet_restore_page_load'),
  navigation: triggerActionTypes('navigation'),
  acceptTermsOfUse: triggerActionTypes('accept_terms_of_use'),
  resetTermsOfUse: triggerActionTypes('reset_terms_of_use'),
  updateBestBlock: triggerActionTypes('update_best_block'),
  updateSyncedBlock: triggerActionTypes('update_synced_block'),
  storeSelectedNetwork: triggerActionTypes('store_selected_network'),
};

export default actionTypes;
