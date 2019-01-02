const assert = require('assert');
const { Given, When, Then } = require('cucumber');

function isItFriday(today) {
  if (today === "Friday") {
    return "TGIF";
  } else {
    return "Nope";
  }
}

Given('today is Sunday', function () {
  this.today = 'Sunday';
});

When('I ask whether it\'s Friday yet', function () {
  this.actualAnswer = isItFriday(this.today);
});

Then('I should be told {string}', function (expectedAnswer) {
  assert.strictEqual(this.actualAnswer, expectedAnswer);
});

Given('today is Friday', function () {
  this.today = 'Friday';
});

Given('today is {string}', function (givenDay) {
  this.today = givenDay;
});
