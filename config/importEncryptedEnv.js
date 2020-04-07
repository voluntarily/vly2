const nodecipher = require('node-cipher')
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const rimraf = require('rimraf')
const { envHasKey } = require('./env')

// importEnv(path?, secret?)
// This will decrypt using node-cipher and import environment variables using dotenv.
//
// path is an optional variable and will default to process.env.ENV_PATH
// secret is an optional variable and will default to process.env.ENV_SECRET
const importEnv = (env_name = process.env.ENV_ENVIRONMENT, secret = process.env.ENV_SECRET) => {
  const input = `${env_name}.env.enc`;
  const output = `${env_name}.env`;

  nodecipher.decryptSync({
    input,
    output,
    password: secret
  });

  const myEnv = dotenv.config({ path: output })
  dotenvExpand(myEnv)
  rimraf.sync(output)
}

// Public API
module.exports = importEnv
