import getActionTypeCreators from 'renderer/helpers/typeCreator';

const ACTION_TYPES_NAME_SPACE = 'ODIN';

const {
  apiActionTypes,
  changedActionTypes,
  triggerActionTypes,
  toggledActionTypes,
  subscriptionActionTypes,
} = getActionTypeCreators(ACTION_TYPES_NAME_SPACE);

const actionTypes = {
  init: triggerActionTypes('init'),
  testPage: triggerActionTypes('test_page'),
  homePageNavigation: triggerActionTypes('home_page_navigation'),
  navigation: triggerActionTypes('navigation'),
  changeAppUiState: triggerActionTypes('change_app_ui_state'),
  resetAppUiState: triggerActionTypes('reset_app_ui_state'),

  enableAnalytics: triggerActionTypes('enable_analytics'),
  disableAnalytics: triggerActionTypes('disable_analytics'),

  walletCreate: apiActionTypes('wallet_create'),
  walletCreatWithSKR: apiActionTypes('wallet_create_with_simple_keyring'),
  walletCreatWithHDKR: apiActionTypes('wallet_create_with_HD_keyring'),
  walletRestoreWithHDKR: apiActionTypes('wallet_restore_with_HD_keyring'),
  walletPaperGenerate: apiActionTypes('wallet_paper_generate'),
  addAccount: apiActionTypes('add_account'),

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
  stakingUnStake: apiActionTypes('staking_un_stake'),
  stakingSavePreferences: apiActionTypes('staking_save_preferences'),
  pendingToSendStakingExtrinsic: triggerActionTypes('pending_to_send_staking_extrinsic'),
  stakingGetValidatorPreferences: apiActionTypes('staking_get_validator_preferences'),
  subscribeValidators: triggerActionTypes('subscribe_validators'),

  /* system apis */
  nodeJsonRpcSystem: apiActionTypes('node_jsonrpc_system'),
  nodeJsonRpcSystemVersion: apiActionTypes('node_jsonrpc_system_version'),
  nodeJsonRpcSystemChain: apiActionTypes('node_jsonrpc_system_chain'),
  nodeJsonRpcSystemName: apiActionTypes('node_jsonrpc_system_name'),
  nodeJsonRpcSystemHealth: apiActionTypes('node_jsonrpc_system_health'),

  nodeWsSystemChain: apiActionTypes('node_ws_system_chain'),
  nodeWsSystemChainPolling: apiActionTypes('node_ws_system_chain_polling'),

  /* chain apis */
  nodeWsChainSubscribeNewHead: apiActionTypes('node_ws_chain_subscribeNewHead'),
  nodeWsChainGetHeaderPolling: apiActionTypes('node_ws_chain_getHeader_polling'),
  nodeWsChainGetHeader: apiActionTypes('node_ws_chain_getHeader'),
  nodeWsRemoteChainGetHeader: apiActionTypes('node_ws_remote_chain_getHeader'),

  /** Extrinsic */
  subscribeExtrinsicStatus: triggerActionTypes('subscribe_extrinsic_status'),
  unsubscribeExtrinsicStatus: triggerActionTypes('unsubscribe_extrinsic_status'),

  /* Sync Stream */
  syncStream: apiActionTypes('sync_stream'),
  syncStreamStatus: changedActionTypes('sync_stream_status'),
  syncStreamPing: apiActionTypes('sync_stream_ping'),
  syncStreamMessage: changedActionTypes('sync_stream_message'),
  syncStreamError: changedActionTypes('sync_stream_error'),

  /* Sync Remote Stream */
  syncRemoteStream: apiActionTypes('sync_remote_stream'),
  syncRemoteStreamStatus: changedActionTypes('sync_remote_stream_status'),
  syncRemoteStreamPing: apiActionTypes('sync_remote_stream_ping'),
  syncRemoteStreamMessage: changedActionTypes('sync_remote_stream_message'),
  syncRemoteStreamError: changedActionTypes('sync_remote_stream_error'),

  /** Toaster */
  successToaster: triggerActionTypes('success_toaster'),
  warningToaster: triggerActionTypes('warning_toaster'),
  errorToaster: triggerActionTypes('error_toaster'),
  infoToaster: triggerActionTypes('info_toaster'),

  /** Notification bar */
  notificationBar: triggerActionTypes('notification_bar'),
};

export default actionTypes;
