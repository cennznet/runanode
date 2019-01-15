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
  homePageLoad: triggerActionTypes('home_page_load'),
  walletRestorePageLoad: triggerActionTypes('wallet_restore_page_load'),
  navigation: triggerActionTypes('navigation'),
  acceptTermsOfUse: triggerActionTypes('accept_terms_of_use'),
  storeSelectedNetwork: triggerActionTypes('store_selected_network'),
  resetLocalStorage: triggerActionTypes('reset_local_storage'),
  toggleRememberNetwork: apiActionTypes('toggle_remember_network'),
  getRememberNetwork: apiActionTypes('get_remember_network'),
  getSelectedNetwork: apiActionTypes('get_selected_network'),
  updateMainNetBestBlock: triggerActionTypes('update_main_net_best_block'),
  updateLocalNetBestBlock: triggerActionTypes('update_local_net_best_block'),

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
};

export default actionTypes;
