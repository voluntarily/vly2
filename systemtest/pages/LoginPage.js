const { I } = inject();

class LoginPage {}

module.exports = {
 
  // insert your locators and methods here
  // setting locators
  fields: {
    email: '#user_basic_email',
    password: '#user_basic_password'
  },
  submitButton: {css: '#new_user_basic input[type=submit]'},

 
  loginWithEmailAsAdmin(email, password) {
    I.fillField(this.fields.email, email); 
    I.fillField(this.fields.password, password);
    I.click(this.submitButton);
  },

  loginWithEmailAsProvider(email, password) {
      I.fillField(this.fields.email, email);
      I.fillField(this.fields.password, password);
      I.click(this.submitButton);
    },

  loginWithEmailAsOrganisation(email, password) {
      I.fillField(this.fields.email, email);
      I.fillField(this.fields.password, password);
      I.click(this.submitButton);
    },

  openPortal() {
    console.log("Going to open voluntarily portal")
    I.amOnPage('https://voluntarily.nz/');
    I.see('We are building a platform that connects corporate volunteer time with classrooms to teach science, technology, engineering, entrepreneurship, arts and design with the help of engaging content supplied by New Zealand’s leading innovators in educational content.');
  },

  register(email, password) {
    // use another page object inside current one
    registerPage.registerUser({ email, password });
  }
}

Object.setPrototypeOf(module.exports, LoginPage.prototype);

