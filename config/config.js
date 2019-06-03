const appName = 'Voluntari.ly'
const databaseName = 'vly2'
const serverPort = process.env.PORT || 3122

const completeConfig = {

  default: {
    appName,
    serverPort,
    databaseUrl: process.env.MONGODB_URI || `mongodb://localhost/${databaseName}`,
    jsonOptions: {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    },
    auth: {
      'AUTH0_CLIENT_ID': 'TsRPTVINZVOdao2Lf7EU8sPDkVZ3VQJY',
      'AUTH0_CLIENT_DOMAIN': 'dev-x6k-p15l.au.auth0.com'
    },
    apiVersion: 'v1'
  },

  development: {
    appUrl: process.env.APP_URL || `http://localhost:${serverPort}`
  },

  test: {
    appUrl: process.env.APP_URL || `http://localhost:${serverPort}`
  },

  production: {
    appUrl: process.env.APP_URL || `https://alpha.voluntari.ly/`
  }

}

// Public API
module.exports = {
  config: { ...completeConfig.default, ...completeConfig[process.env.NODE_ENV] },
  completeConfig
}
