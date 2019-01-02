// @flow
import type {
  Odin,
  WebdriverClient
} from '../global-types';
import { getProcessesByName } from '../../../app/main/utils/processes';

declare var odin: Odin;

// export const getCennzNetNodeState = async (client: WebdriverClient) => (
//   (await client.execute(() => odin.stores.networkStatus.cennznetNodeState)).value
// );

export const waitForCennzNetNodeToExit = async (client: WebdriverClient) => (
  await client.waitUntil(async () => (
    (await getProcessesByName('cennznet-node')).length === 0
  ), 61000)
);
