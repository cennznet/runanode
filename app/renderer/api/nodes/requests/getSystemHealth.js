// @flow
import type { RequestConfig } from '../../common/types';
import type { NodeInfo } from '../types';
import { request } from '../../utils/request';

export type NodeQueryParams = {
  force_ntp_check: boolean,
};

export const getSystemHealth = (
  config: RequestConfig,
  queryParams?: NodeQueryParams,
): Promise<NodeInfo> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: '/',
    ...config,
  }, queryParams, { "jsonrpc": "2.0", "method":"system_health", "params":[], "id": 1 })
);
