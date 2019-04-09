// @flow
import type { WebdriverClient } from '../global-types';
import { getProcessesByName } from '../../../app/main/utils/processes';

export const waitForAppToExit = async (client: WebdriverClient, timeout: number = 61000) => {
  const appProcessName = process.platform === 'linux' ? 'electron' : 'Electron';
  return await client.waitUntil(
    async () => (await getProcessesByName(appProcessName)).length === 0,
    timeout
  );
};

export const refreshClient = async (client: WebdriverClient) => {
  await client.url(`file://${__dirname}/../../../app/app.html`);
};
