const { I } = inject()

class LoginPage {}

module.exports = {

  // insert your locators and methods here
  // setting locators
  fields: {
    email: '#user_basic_email',
    password: '#user_basic_password'
  },
  submitButton: { css: '#new_user_basic input[type=submit]' },

  loginWithEmailAsAdmin (email, password) {
    I.fillField(this.fields.email, email)
    I.fillField(this.fields.password, password)
    I.click(this.submitButton)
  },

  loginWithEmailAsProvider (email, password) {
    I.fillField(this.fields.email, email)
    I.fillField(this.fields.password, password)
    I.click(this.submitButton)
  },

  loginWithEmailAsOrganisation (email, password) {
    I.fillField(this.fields.email, email)
    I.fillField(this.fields.password, password)
    I.click(this.submitButton)
  },

  register (email, password) {
    // use another page object inside current one
    registerPage.registerUser({ email, password })
  }
}

Object.setPrototypeOf(module.exports, LoginPage.prototype)
