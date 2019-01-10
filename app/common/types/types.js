import getActionTypeCreators from 'common/helpers/typeCreator';

const ACTION_TYPES_NAME_SPACE = 'ODIN';

const {
  apiActionTypes,
  changedActionTypes,
  triggerActionTypes
} = getActionTypeCreators(ACTION_TYPES_NAME_SPACE);

export default {
  // cennzNode RPC API
  nodeApiSystemName: apiActionTypes('node_api_system_name'),
  nodeApiSystemHealth: apiActionTypes('node_api_system_health'),
};
