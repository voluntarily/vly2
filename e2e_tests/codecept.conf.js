const { setHeadlessWhen, setWindowSize } = require('@codeceptjs/configure')
// Config to run .feature files - BDD tests

// run headless when CI environment variable set
setHeadlessWhen(process.env.CI)
// set window size for any helper: Puppeteer, WebDriver, TestCafe
setWindowSize(1600, 1200)

exports.config = {
  tests: './features/*',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3122',
      show: true,
      smartWait: 1000,
      waitForTimeout: 60000,
      windowSize: '1200x900'
    }
  },
  gherkin: {
    features: "./features/*.feature",
    steps: [
      "./step_definitions/steps.js"
    ]
  },
  include: {
    I: './steps_file.js',
    offersPage: './pages/OfferPage.js',
    loginPage: './pages/LoginPage.js',
    registrationPage: './pages/RegistrationPage.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'e2e_features',
  plugins: {
    retryFailedStep: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
  
}
