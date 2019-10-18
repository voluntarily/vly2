const { I } = inject()

module.exports = {

  fields: {
    email: '#user_basic_email',
    password: '#user_basic_password',
    name: '#name'
  },
  submitButton: { css: '#new_user_basic input[type=submit]' },

  registerUser (email, password) {
    I.fillField(email, email)
    I.fillField(password, password)
    I.fillField(name, name)
    I.click(this.submitButton)
  }
}
