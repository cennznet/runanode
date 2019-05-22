Feature: Quitting App

  App can be quit in multiple (and unexpected) ways and
  has to cleanup and stop theNode before exiting.

  @slow @restartApp
  Scenario: Closing the main window
    Given App is running
    And theNode is running
    When I close the main window
    Then theNode process is not running
    Then App process is not running
