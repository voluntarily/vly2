const { checkEnvVars } = require('./env')
checkEnvVars({
  required: 'AUTH0_CLIENT_ID AUTH0_CLIENT_DOMAIN',
  optional: 'PORT APPNAME NODE_ENV DBNAME MONGODB_URI SMTP_ID SMTP_PWD REVISION'
})

const databaseName = process.env.DBNAME || 'vly2'
const serverPort = process.env.PORT || 3122

const completeConfig = {

  default: {
    appName: process.env.APPNAME || 'Voluntarily NZ',
    serverPort,
    env: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.MONGODB_URI || `mongodb://127.0.0.1/${databaseName}`,
    revision: process.env.REVISION || 'local-build',
    jsonOptions: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    },
    auth: {
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_CLIENT_DOMAIN: process.env.AUTH0_CLIENT_DOMAIN
    },
    apiVersion: 'v1',
    SMTP_ID: process.env.SMTP_ID || '',
    SMTP_PWD: process.env.SMTP_PWD || '',
    onlyEmailText: process.env.TEXT_ONLY_EMAIL === 'true',
    ADDRESS_FINDER_KEY: process.env.ADDRESS_FINDER_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    BADGR_USERNAME: process.env.BADGR_USERNAME,
    BADGR_PASSWORD: process.env.BADGR_PASSWORD,
    BADGR_API: process.env.BADGR_API || 'https://api.au.badgr.io',
    verification: {
      cloudcheck: {
        url: process.env.CLOUDCHECK_URL || 'https://api.cloudcheck.co.nz',
        apiKey: process.env.CLOUDCHECK_API_KEY,
        secret: process.env.CLOUDCHECK_SECRET || 'mySecret'
      }
    }
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
