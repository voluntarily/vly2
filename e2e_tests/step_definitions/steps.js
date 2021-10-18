const { I } = inject()
// Add in your custom step files
const loginPage = require('../pages/LoginPage')
const landingPage = require('../pages/LandingPage')
const offerPage = require('../pages/OfferPage')

Given('I visit voluntarily', () => {
  landingPage.openPortal()
})

Then('I can see the anon menu', () => {
  I.see('About')
  I.see('Support')
  I.see('Sign in')
})

// parameters are passed in via Cucumber expressions
Then('I can see the call to action', () => {
  I.see('People helping people')
  I.seeElement('//a[contains(., "Sign in")]') // menu item
  I.seeElement('//button[contains(., "Get started")]') // button
  I.seeElement('//a[contains(., "Learn more")]')
  I.seeElement({ react: 'Hero', props: { isAuthenticated: false } })
})

Then('I can see all offers button', () => {
  // From "features/public.feature" {"line":15,"column":5}
  I.seeElement('//button[contains(., "See all offers")]') 
  I.seeElement('//button[contains(., "See all asks")]') 
});

When('I click all offers', () => {
  // From "features/public.feature" {"line":16,"column":5}
  I.click('See all offers');
});

Then('I can see the offers page', () => {
  // From "features/public.feature" {"line":17,"column":5}
  I.see('People are asking for help with')
  I.seeElement('input').withAttr({ placeholder: 'search for' });  // search
  I.seeElement('figure') // opportunity
})

Given( "I visit the offers listing", () => {
  I.amOnPage('/acts/type/offer')
})
Then( "I can see multiple offers", () => {
  I.seeElement(locate('figure').at(1)) // opportunity
  I.seeElement(locate('figure').at(2)) // opportunity
})

When("I click an offer", () => {
  I.click(locate('figure').at(1))
})

Then("I can see the offer detail page", () => {
  offerPage.checkOfferPageAnon()
})

Then('I can navigate the public pages', () => {
  landingPage.checkAboutPage()
  landingPage.checkGetInvolvedPage()
})

Then('I can login into the Voluntarily system', () => {
  // From "features\basic.feature" {"line":12,"column":5}

})

Then('I can create an opportunity', () => {
  // From "features\basic.feature" {"line":13,"column":5}

})

Then('I can search its content', () => {
  // From "features\basic.feature" {"line":9,"column":6}
  throw new Error('Not implemented yet')
})

Then('I can login into the Voluntarily system as an Admin', () => {
  // From "features\basic.feature" {"line":13,"column":5}
  throw new Error('Not implemented yet')
})

Then('I can login into the Voluntarily system as a Provider', () => {
  // From "features\basic.feature" {"line":18,"column":5}
  throw new Error('Not implemented yet')
})

Then('I can login into the Voluntarily system as an Organisation', () => {
  // From "features\basic.feature" {"line":23,"column":5}
  throw new Error('Not implemented yet')
})

When('I can register into the Voluntarily system', () => {
  // From "features\basic.feature" {"line":28,"column":5}
  throw new Error('Not implemented yet')
})

Then('I can login into the Voluntarily system as {string}', () => {
  // From "features\basic.feature" {"line":23,"column":5}
  throw new Error('Not implemented yet')
})

