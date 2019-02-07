// @flow
import { Given, Then } from 'cucumber';
import { CennzNetNodeStates } from '../../app/common/types/cennznet-node.types';
import {
  getCennzNetNodeState,
  waitForCennzNetNodeToExit
} from '../support/helpers/cennznet-node-helpers';

Given(/^cennznet-node is running$/, async function () {
  return await this.client.waitUntil(async () => (
    await getCennzNetNodeState(this.client) === CennzNetNodeStates.RUNNING
  ));
});

Then(/^cennznet-node process is not running$/, { timeout: 61000 }, async function () {
  return waitForCennzNetNodeToExit(this.client);
});
