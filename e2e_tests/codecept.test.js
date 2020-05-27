const { setHeadlessWhen, setWindowSize } = require('@codeceptjs/configure')
// Config to run _test files - simple non BDD tests
// run headless when CI environment variable set
setHeadlessWhen(process.env.CI)
// set window size for any helper: Puppeteer, WebDriver, TestCafe
setWindowSize(1600, 1200)

exports.config = {
  tests: './tests/*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3122',
      show: true
      // windowSize: '1200x900'
    }
  },
  include: {
    I: './steps_file.js',
    loginPage: './pages/LoginPage.js',
    registrationPage: './pages/RegistrationPage.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'e2e_tests',
  plugins: {
    retryFailedStep: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
  
}
