import getActionTypeCreators from 'renderer/helpers/typeCreator';

import config from 'app/config';

const ACTION_TYPES_NAME_SPACE = config.app.name;

const { apiActionTypes, changedActionTypes, triggerActionTypes } = getActionTypeCreators(
  ACTION_TYPES_NAME_SPACE
);

const actionTypes = {
  init: triggerActionTypes('init'),
  testPage: triggerActionTypes('test_page'),
  homePageNavigation: triggerActionTypes('home_page_navigation'),
  navigation: triggerActionTypes('navigation'),
  changeAppUiState: triggerActionTypes('change_app_ui_state'),
  resetAppUiState: triggerActionTypes('reset_app_ui_state'),

  enableAnalytics: triggerActionTypes('enable_analytics'),
  disableAnalytics: triggerActionTypes('disable_analytics'),

  subscribeFinalisedHeads: triggerActionTypes('subscribe_finalised_heads'),
  subscribeNewHead: triggerActionTypes('subscribe_new_head'),
  subscribeNewHeadRemote: triggerActionTypes('subscribe_new_head_remote'),
  finalisedHeader: changedActionTypes('finalised_header'),
  newHead: changedActionTypes('new_head'),
  newHeadRemote: changedActionTypes('new_head_remote'),

  getAllAccountsBalances: apiActionTypes('get_all_accounts_balances'),
  walletCreatWithSKR: apiActionTypes('wallet_create_with_simple_keyring'),
  walletCreatWithHDKR: apiActionTypes('wallet_create_with_HD_keyring'),
  walletRestoreWithHDKR: apiActionTypes('wallet_restore_with_HD_keyring'),
  walletPaperGenerate: apiActionTypes('wallet_paper_generate'),
  addAccount: apiActionTypes('add_account'),
  updateAccountName: apiActionTypes('update_account_name'),

  /* Local storage */
  resetLocalStorage: triggerActionTypes('reset_local_storage'),
  acceptTermsOfUse: triggerActionTypes('accept_terms_of_use'),
  storeNetworkOption: triggerActionTypes('store_network_option'),
  storeUploadedGenesisInfo: triggerActionTypes('store_upload_genesis_file_info'),
  setStorage: apiActionTypes('set_storage'),
  getStorage: apiActionTypes('get_storage'),
  clearStorage: apiActionTypes('clear_storage'),
  syncWalletData: apiActionTypes('sync_wallet_data'),
  transfer: apiActionTypes('transfer'),

  /* Network */
  nodeStateChange: triggerActionTypes('network_state_change'),
  cenznetStatusChange: triggerActionTypes('cennznet_status_change'),
  switchNetwork: triggerActionTypes('switch_network'),
  stopStream: apiActionTypes('stop_stream'),
  restartNode: triggerActionTypes('restart_network'),
  subscribeCenznetStatusChange: triggerActionTypes('subscribe_cennznet_status_change'),

  /* Staking */
  stake: triggerActionTypes('stake'),
  sendStakingExtrinsic: triggerActionTypes('send_staking_extrinsic'),
  stakingExtrinsicCompleted: triggerActionTypes('staking_extrinsic_completed'),
  pendingToSendStakingExtrinsic: triggerActionTypes('pending_to_send_staking_extrinsic'),
  unStake: triggerActionTypes('staking_un_stake'),
  sendUnExtrinsic: triggerActionTypes('send_un_stake_extrinsic'),
  unStakeExtrinsicCompleted: triggerActionTypes('un_stake_extrinsic_completed'),
  stakingSavePreferences: apiActionTypes('staking_save_preferences'),
  stakingGetValidatorPreferences: apiActionTypes('staking_get_validator_preferences'),
  subscribeValidators: triggerActionTypes('subscribe_validators'),

  /* system apis */
  nodeJsonRpcSystem: apiActionTypes('node_jsonrpc_system'),
  nodeJsonRpcSystemVersion: apiActionTypes('node_jsonrpc_system_version'),
  nodeJsonRpcSystemChain: apiActionTypes('node_jsonrpc_system_chain'),
  nodeJsonRpcSystemName: apiActionTypes('node_jsonrpc_system_name'),
  nodeJsonRpcSystemHealth: apiActionTypes('node_jsonrpc_system_health'),

  nodeWsSystemChain: apiActionTypes('node_ws_system_chain'),
  nodeWsSystemChainRemote: apiActionTypes('node_ws_system_chain_remote'),

  /* chain apis */
  nodeWsChainSubscribeNewHead: apiActionTypes('node_ws_chain_subscribeNewHead'),
  nodeWsChainGetHeaderPolling: apiActionTypes('node_ws_chain_getHeader_polling'),
  nodeWsChainGetHeader: apiActionTypes('node_ws_chain_getHeader'),
  nodeWsRemoteChainGetHeader: apiActionTypes('node_ws_remote_chain_getHeader'),

  /** Extrinsic */
  subscribeExtrinsicStatus: triggerActionTypes('subscribe_extrinsic_status'),
  unsubscribeExtrinsicStatus: triggerActionTypes('unsubscribe_extrinsic_status'),

  /** Toaster */
  successToaster: triggerActionTypes('success_toaster'),
  warningToaster: triggerActionTypes('warning_toaster'),
  errorToaster: triggerActionTypes('error_toaster'),
  infoToaster: triggerActionTypes('info_toaster'),

  /** Notification bar */
  notificationBar: triggerActionTypes('notification_bar'),
};

export default actionTypes;
