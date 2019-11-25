const databaseName = process.env.DBNAME || 'vly2'
const serverPort = process.env.PORT || 3122

const completeConfig = {

  default: {
    appName: process.env.APPNAME || 'Voluntarily NZ',
    serverPort,
    env: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.MONGODB_URI || `mongodb://localhost/${databaseName}`,
    jsonOptions: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    },
    auth: {
      AUTH0_CLIENT_ID: 'S4yd4VgZ92NIjhwO3vt4h0Gifb9mXv1k',
      AUTH0_CLIENT_DOMAIN: 'voluntarily.au.auth0.com'
    },
    apiVersion: 'v1',
    SMTP_ID: process.env.SMTP_ID || '',
    SMTP_PWD: process.env.SMTP_PWD || '',
    onlyEmailText: process.env.TEXT_ONLY_EMAIL === 'true',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    BADGR_USERNAME: process.env.BADGR_USERNAME,
    BADGR_PASSWORD: process.env.BADGR_PASSWORD,
    BADGR_API: process.env.BADGR_API || 'https://api.au.badgr.io'
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
  // completeConfig
}
