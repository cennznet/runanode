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
  updateMainNetBestBlock: triggerActionTypes('update_main_net_best_block'),
  updateLocalNetBestBlock: triggerActionTypes('update_local_net_best_block'),
  nodeApiSystemName: apiActionTypes('node_api_system_name'),
  nodeApiSystemHealth: apiActionTypes('node_api_system_health'),
};

export default actionTypes;
