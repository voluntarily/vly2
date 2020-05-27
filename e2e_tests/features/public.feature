Feature: Voluntarily Public Access
  In order to find out more about Voluntarily
  As a visitor
  I want to be able to read about the platform

@smoke
  Scenario: Smoke Test for public Voluntarily Portal Navigation
    Given I visit voluntarily   
    Then I can see the anon menu
    And I can see the call to action
    And I can navigate the public pages
  
  Scenario: Smoke Test for public offers listing viewing
    Given I visit voluntarily   
    Then I can see all offers button
    When I click all offers
    Then I can see the offers page

  Scenario: Smoke test for public offer view
    Given I visit the offers listing 
    Then I can see multiple offers
    When I click an offer
    Then I can see the offer detail page
  
  