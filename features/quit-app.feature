Feature: Quitting App

  App can be quit in multiple (and unexpected) ways and
  has to cleanup and stop cennznet-node before exiting.

  @slow @restartApp
  Scenario: Closing the main window
    Given App is running
    And cennznet-node is running
    When I close the main window
    Then cennznet-node process is not running
    Then App process is not running
