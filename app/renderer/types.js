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
  navigation: triggerActionTypes('navigation'),

  /* Local storage */
  resetLocalStorage: triggerActionTypes('reset_local_storage'),
  acceptTermsOfUse: triggerActionTypes('accept_terms_of_use'),
  storeNetworkOption: triggerActionTypes('store_network_option'),
  setStorage: apiActionTypes('set_storage'),
  getStorage: apiActionTypes('get_storage'),
  clearStorage: apiActionTypes('clear_storage'),

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
