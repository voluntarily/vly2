const { I } = inject()

class LandingPage {}

module.exports = {

  // insert your locators and methods here
  // setting locators
  fields: {
    email: '#user_basic_email',
    password: '#user_basic_password'
  },
  submitButton: { css: '#new_user_basic input[type=submit]' },

  openPortal () {
    console.log('Going to open voluntarily portal')
    I.amOnPage('https://voluntarily.nz/')
    I.see('About')
    I.see('Organisations')
    I.see('Lost 🧐')
  },

  checkAboutPage () {
    I.amOnPage('https://blog.voluntarily.nz/')
    I.see('HOME')
    I.see('HELP US BUILD')
    I.see('PRE-REGISTER')
    I.see('SPONSER')
  }

}

Object.setPrototypeOf(module.exports, LandingPage.prototype)
