// @flow
import type { App, WebdriverClient } from '../global-types';
import { getProcessesByName } from '../../../app/main/utils/processes';
import { CennzNetNodeStates } from '../../../app/common/types/cennznet-node.types';

declare var app: App;

export const getCennzNetNodeState = async (client: WebdriverClient): CennzNetNodeStates =>
  (await client.execute(() => {
    return app.store.getState().nodeStateStore.state;
  })).value;

export const waitForCennzNetNodeToExit = async (client: WebdriverClient) =>
  await client.waitUntil(
    async () => (await getProcessesByName('cennznet-node')).length === 0,
    61000
  );
