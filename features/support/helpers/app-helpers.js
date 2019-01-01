// @flow
import type { WebdriverClient } from '../global-types';
import { getProcessesByName } from '../../../app/main/utils/processes';

export const waitForOdinToExit = async (client: WebdriverClient, timeout: number = 61000) => {
  const odinProcessName = process.platform === 'linux' ? 'electron' : 'Electron';
  return await client.waitUntil(async () => (
    (await getProcessesByName(odinProcessName)).length === 0
  ), timeout);
};

export const refreshClient = async (client: WebdriverClient) => {
  await client.url(`file://${__dirname}/../../../app/app.html`);
};
