// @flow
import { Given, Then } from 'cucumber';
import { TheNodeStates } from '../../app/common/types/theNode.types';
import { getTheNodeState, waitForTheNetNodeToExit } from '../support/helpers/theNodeHelpers';

Given(/^theNode is running$/, async function() {
  return await this.client.waitUntil(
    async () => (await getTheNodeState(this.client)) === TheNodeStates.RUNNING
  );
});

Then(/^theNode process is not running$/, { timeout: 61000 }, async function() {
  return waitForTheNetNodeToExit(this.client);
});
