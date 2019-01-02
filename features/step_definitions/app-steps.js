// @flow
import { Given, When, Then } from 'cucumber';
// $FlowFixMe
import { expect } from 'chai';
import type { Odin } from '../support/global-types';
import { waitUntilTextInSelector } from '../support/helpers/shared-helpers';
import { waitForCennzNetNodeToExit } from '../support/helpers/cennznet-node-helpers';
import { refreshClient, waitForOdinToExit } from '../support/helpers/app-helpers';

const assert = require('assert');

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
  // TODO refactor to use odin
  // await this.client.execute(() => odin.stores.window.closeWindow());
  await this.client.execute(() => window.ipcRenderer.send('close-window'));
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
