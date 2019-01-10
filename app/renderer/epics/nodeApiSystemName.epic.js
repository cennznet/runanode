import { createJsonRpcAPICallEpic } from 'common/helpers/createAPICallEpic';
import types from 'common/types/types';
import urls from 'common/types/urls';

const nodeApiSystemNameEpic = createJsonRpcAPICallEpic({
  type: types.nodeApiSystemName,
  url: urls.api.root,
  jsonRpcMethod: 'system_name',
  jsonRpcParams: [],
  // mapRequest: () => ({ jsonrpc: "2.0", method:"system_health", params:[], id: 1 }),
  // mapResponse: (x) => {
  //   console.log(x);
  //   return x.status;
  // }
});

// export const nodeApiSystemHealthEpic = createJsonRpcAPICallEpic({
//   type: types.nodeApiSystemHealth,
//   url: urls.api.root,
//   jsonRpcMethod: 'system_health',
//   jsonRpcParams: [],
// });

export default nodeApiSystemNameEpic;
