const secureEnv = require('secure-env')
const { envHasKey } = require('./env')

// importEnv(path?, secret?)
// This will decrypt and import environment variables using secure-env.
//
// path is an optional variable and will default to process.env.ENV_PATH
// secret is an optional variable and will default to process.env.ENV_SECRET
const importEnv = (path = process.env.ENV_PATH, secret = process.env.ENV_SECRET) => {
  const decryptedEnv = secureEnv({ path, secret })
  // Merge decrypted environment variables into process.env
  Object.entries(decryptedEnv).forEach(([key, value]) => {
    if (!envHasKey(key)) {
      process.env[key] = value
    } else {
      console.warn(`"${key}" has already been defined won't be overwritten`)
    }
  })
}

// Public API
module.exports = importEnv
