Feature: Voluntarily Portal Checks
  In order to achieve my goals
  As a persona
  I want to be able to interact with Voluntarily system

@smoke
  Scenario: Smoke Test for Voluntarily Portal Navigation
    Given I open the Voluntarily portal   
    Then I can navigate through all pages successfully

  Scenario: Voluntarily Login as an Admin
    Given I open the Voluntarily portal
    Then I can login into the Voluntarily system as "Admin"
    And I can create an opportunity

  Scenario: Voluntarily Login as a Provider
    Given I open the Voluntarily portal
    Then I can login into the Voluntarily system as "Provider"
    And I can create an opportunity

  Scenario: Voluntarily Login as a Provider
    Given I open the Voluntarily portal
    Then I can login into the Voluntarily system as "Organisation"
    And I can create an opportunity

  Scenario: Voluntarily Login after Registeration Test
    Given I open the Voluntarily portal
    When I can register into the Voluntarily system
    Then I can login into the Voluntarily system