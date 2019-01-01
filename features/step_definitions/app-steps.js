// @flow
import { Given, When, Then } from 'cucumber';
import { expect } from 'chai';
const assert = require('assert');
import type { Odin } from '../support/global-types';
import { waitUntilTextInSelector } from '../support/helpers/shared-helpers';
import { waitForCennzNetNodeToExit } from '../support/helpers/cennznet-node-helpers';
import { refreshClient, waitForOdinToExit } from '../support/helpers/app-helpers';

declare var odin: Odin;

Given(/^Odin is running$/, function () {
  console.log('Odin is running', this.app.isRunning());
  expect(this.app.isRunning()).to.be.true;
});

When(/^I refresh the main window$/, async function () {
  await refreshClient(this.client);
});

When(/^I close the main window$/, async function () {
  console.log('I close the main window');
  // TODO
  // await this.client.execute(() => odin.stores.window.closeWindow());
});

Then(/^Odin process is not running$/, async function () {
  await waitForOdinToExit(this.client);
});

Then(/^Odin should quit$/, { timeout: 70000 }, async function () {
  await waitForCennzNetNodeToExit(this.client);
  await waitForOdinToExit(this.client);
});

Then(/^I should see the loading screen with "([^"]*)"$/, async function (message) {
  await waitUntilTextInSelector(this.client, {
    selector: '.Loading_connecting h1',
    text: message
  });
});
