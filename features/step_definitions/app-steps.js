// @flow
import { Given, When, Then } from 'cucumber';
// $FlowFixMe
import { expect } from 'chai';
import type { App } from '../support/global-types';
import { waitUntilTextInSelector } from '../support/helpers/shared-helpers';
import { waitForCennzNetNodeToExit } from '../support/helpers/cennznet-node-helpers';
import { refreshClient, waitForAppToExit } from '../support/helpers/app-helpers';

const assert = require('assert');

declare var app: App;

Given(/^App is running$/, function() {
  expect(this.app.isRunning()).to.be.true;
});

When(/^I refresh the main window$/, async function() {
  await refreshClient(this.client);
});

When(/^I close the main window$/, async function() {
  // TODO refactor to use app
  // await this.client.execute(() => app.stores.window.closeWindow());
  await this.client.execute(() => window.ipcRenderer.send('close-window'));
});

Then(/^App process is not running$/, async function() {
  await waitForAppToExit(this.client);
});

Then(/^App should quit$/, { timeout: 70000 }, async function() {
  await waitForCennzNetNodeToExit(this.client);
  await waitForAppToExit(this.client);
});

Then(/^I should see the loading screen with "([^"]*)"$/, async function(message) {
  await waitUntilTextInSelector(this.client, {
    selector: '.Loading_connecting h1',
    text: message,
  });
});
