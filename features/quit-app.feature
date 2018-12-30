Feature: Quitting Odin

  Odin can be quit in multiple (and unexpected) ways and
  has to cleanup and stop cennznet-node before exiting.

  @slow @restartApp
  Scenario: Closing the main window
    Given Odin is running
    And cennznet-node is running
    When I close the main window
    Then cennznet-node process is not running
    And Odin process is not running

  @slow @restartApp
  Scenario: Closing the main window, while cennznet ignores exit request
    Given Odin is running
    And cennznet-node is running
    When I inject fault named "FInjIgnoreShutdown"
    And I close the main window
    Then I should see the loading screen with "Stopping Cardano node"
    And cennznet-node process is not running
    And Odin process is not running
