/* eslint-disable */
const { I } = inject()
// Add in your custom step files
const loginPage = require('../pages/LoginPage')
const landingPage = require('../pages/LandingPage')

Given('I have a defined step', () => {
  // TODO: replace with your own step

})

Given('I open the Voluntarily portal', () => {
  loginPage.openPortal()
})

Then('I can navigate through all pages successfully', () => {
  // From "features\basic.feature" {"line":8,"column":5}
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
