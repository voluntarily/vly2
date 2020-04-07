const nodecipher = require('node-cipher')
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const { envHasKey } = require('./env')

// importEnv(path?, secret?)
// This will decrypt using node-cipher and import environment variables using dotenv.
//
// path is an optional variable and will default to process.env.ENV_PATH
// secret is an optional variable and will default to process.env.ENV_SECRET
const importEnv = (env_name = process.env.ENV_ENVIRONMENT, secret = process.env.ENV_SECRET) => {
  nodecipher.decryptSync({
    input: `${env_name}.env.enc`,
    output: `${env_name}.env`,
    password: secret
  });

  var myEnv = dotenv.config({ path: `${env_name}.env` })
  dotenvExpand(myEnv)
}

// Public API
module.exports = importEnv
