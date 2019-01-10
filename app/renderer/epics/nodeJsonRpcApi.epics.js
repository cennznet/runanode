import { createJsonRpcAPICallEpic } from 'renderer/helpers/createAPICallEpic';
import types from 'renderer/types';
import urls from 'renderer/constants/urls';

const nodeApiSystemNameEpic = createJsonRpcAPICallEpic({
  type: types.nodeApiSystemName,
  url: urls.API.JSONRPC,
  jsonRpcMethod: 'system_name',
  jsonRpcParams: [],
});

const nodeApiSystemHealthEpic = createJsonRpcAPICallEpic({
  type: types.nodeApiSystemHealth,
  url: urls.API.JSONRPC,
  jsonRpcMethod: 'system_health',
  jsonRpcParams: [],
  mapResponse: (x) => {
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

export default [nodeApiSystemNameEpic, nodeApiSystemHealthEpic];
