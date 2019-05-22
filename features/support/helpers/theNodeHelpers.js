// @flow
import type { App, WebdriverClient } from '../global-types';
import { getProcessesByName } from '../../../app/main/utils/processes';
import { TheNodeStates } from '../../../app/common/types/theNode.types';

declare var app: App;

export const getTheNodeState = async (client: WebdriverClient): TheNodeStates =>
  (await client.execute(() => {
    return app.store.getState().nodeStateStore.state;
  })).value;

export const waitForTheNetNodeToExit = async (client: WebdriverClient) =>
  await client.waitUntil(
    async () => (await getProcessesByName('cennznet-node')).length === 0,
    61000
  );
