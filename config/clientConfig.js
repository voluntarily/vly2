const { checkEnvVars } = require('./env')
// checkEnvVars({
//   required: 'AUTH0_CLIENT_ID AUTH0_CLIENT_DOMAIN',
//   optional: 'PORT APPNAME NODE_ENV APP_URL'
// })

const serverPort = process.env.PORT || 3122

const completeConfig = {

  default: {
    appName: process.env.APPNAME || 'Voluntarily NZ',
    serverPort,
    env: process.env.NODE_ENV || 'development',
    jsonOptions: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    },
    auth: {
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || 'S4yd4VgZ92NIjhwO3vt4h0Gifb9mXv1k',
      AUTH0_CLIENT_DOMAIN: process.env.AUTH0_CLIENT_DOMAIN || 'voluntarily.au.auth0.com'
    },
    apiVersion: 'v1',
    knowledgebaseURL: 'https://voluntarily.atlassian.net/servicedesk/customer/portals?q='
  },

  development: {
    appUrl: process.env.APP_URL || `http://localhost:${serverPort}`
  },

  test: {
    appUrl: process.env.APP_URL || `http://localhost:${serverPort}`
  },

  production: {
    appUrl: process.env.APP_URL
  }

}

// Public API
module.exports = {
  config: { ...completeConfig.default, ...completeConfig[process.env.NODE_ENV] }
}
