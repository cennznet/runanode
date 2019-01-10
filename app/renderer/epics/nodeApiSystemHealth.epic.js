import { createJsonRpcAPICallEpic } from 'common/helpers/createAPICallEpic';
import types from 'common/types/types';
import urls from 'common/types/urls';

// const nodeApiSystemNameEpic = createJsonRpcAPICallEpic({
//   type: types.nodeApiSystemName,
//   url: urls.api.root,
//   jsonRpcMethod: 'system_name',
//   jsonRpcParams: [],
//   // mapRequest: () => ({ jsonrpc: "2.0", method:"system_health", params:[], id: 1 }),
//   // mapResponse: (x) => {
//   //   console.log(x);
//   //   return x.status;
//   // }
// });

const nodeApiSystemHealthEpic = createJsonRpcAPICallEpic({
  type: types.nodeApiSystemHealth,
  url: urls.api.root,
  jsonRpcMethod: 'system_health',
  jsonRpcParams: [],
  mapResponse: (x) => {
    console.log('nodeApiSystemHealthEpic mapResponse');
    console.log(x);
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

export default nodeApiSystemHealthEpic;
