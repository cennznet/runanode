import { combineEpics } from 'redux-observable';
import chainEpics from 'renderer/epics/chainEpics';
import { createJsonRpcAPICallEpic } from 'renderer/helpers/createAPICallEpic';
import types from 'renderer/types';
import config from 'renderer/utils/config';

const nodeJsonRpcSystemNameEpic = createJsonRpcAPICallEpic({
  type: types.nodeJsonRpcSystemName,
  url: config.urls.LOCAL_JSONRPC,
  jsonRpcMethod: 'system_name',
  jsonRpcParams: [],
});

const nodeJsonRpcSystemChainEpic = createJsonRpcAPICallEpic({
  type: types.nodeJsonRpcSystemChain,
  url: config.urls.LOCAL_JSONRPC,
  jsonRpcMethod: 'system_chain',
  jsonRpcParams: [],
});

const nodeJsonRpcSystemVersionEpic = createJsonRpcAPICallEpic({
  type: types.nodeJsonRpcSystemVersion,
  url: config.urls.LOCAL_JSONRPC,
  jsonRpcMethod: 'system_version',
  jsonRpcParams: [],
});

const nodeJsonRpcSystemHealthEpic = createJsonRpcAPICallEpic({
  type: types.nodeJsonRpcSystemHealth,
  url: config.urls.LOCAL_JSONRPC,
  jsonRpcMethod: 'system_health',
  jsonRpcParams: [],
  mapResponse: (x) => {
    // TODO why isSyncing=true and error with "code: 2001, message: node is not healthy"?
    if(x.response.error && x.response.error.data) {
      return ({
        code: x.response.error.code,
        message: x.response.error.message,
        isSyncing: x .response.error.data.is_syncing,
        peers: x.response.error.data.peers,
      });
    }
    return ({
      isSyncing: x.response.result.is_syncing,
      peers: x.response.result.peers,
    });
  }
});

const chainNodeJsonRpcSystemNameEpic = chainEpics(
  types.nodeJsonRpcSystem.requested,
  types.nodeJsonRpcSystemName.requested,
);

const chainNodeJsonRpcSystemChainEpic = chainEpics(
  types.nodeJsonRpcSystem.requested,
  types.nodeJsonRpcSystemChain.requested,
);

const chainNodeJsonRpcSystemVersionEpic = chainEpics(
  types.nodeJsonRpcSystem.requested,
  types.nodeJsonRpcSystemVersion.requested,
);

const chainNodeJsonRpcSystemHealthEpic = chainEpics(
  types.nodeJsonRpcSystem.requested,
  types.nodeJsonRpcSystemHealth.requested,
);

const nodeJsonRpcSystemEpic = combineEpics(
  chainNodeJsonRpcSystemNameEpic,
  chainNodeJsonRpcSystemChainEpic,
  chainNodeJsonRpcSystemHealthEpic,
  chainNodeJsonRpcSystemVersionEpic,
);

export default [nodeJsonRpcSystemNameEpic, nodeJsonRpcSystemHealthEpic, nodeJsonRpcSystemChainEpic, nodeJsonRpcSystemVersionEpic, nodeJsonRpcSystemEpic];
