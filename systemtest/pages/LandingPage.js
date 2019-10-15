const { I } = inject();

class LandingPage {}

module.exports = {
 
  // insert your locators and methods here
  // setting locators
  fields: {
    email: '#user_basic_email',
    password: '#user_basic_password'
  },
  submitButton: {css: '#new_user_basic input[type=submit]'},

  

  openPortal() {
    console.log("Going to open voluntarily portal")
    I.amOnPage('https://voluntarily.nz/');
    I.see('Home');
    I.see('About');
    I.see('Get Involved');
  },

  checkAboutPage() {    
    I.amOnPage('https://voluntarily.nz/about'); 
    I.see('About Voluntarily');  
  },

  checkGetInvolvedPage() {    
    I.amOnPage('https://voluntarily.nz/get-involved');
    I.see('Developers');
    I.see('Volunteers');
    I.see('Sponsorship');
    I.see('HELP BUILD THE PLATFORM');
    I.see('BECOME A VOLUNTEER');
    I.see('CONTACT US');
    I.see('DEVELOPER CHATROOM');
    I.see('GITHUB');
    I.see('CONTACT US');
  },

}

Object.setPrototypeOf(module.exports, LandingPage.prototype);

