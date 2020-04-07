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
  if(env_name && secret) {
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
  } else {
    console.warn(`
    ENV_ENVIRONMENT and/or ENV_SECRET haven't been defined as environment variables and so we won't parse an encrypted environment file.
    Please make sure to pass all required environment variables for the application, otherwise may get errors and unexpected behaviour.
    `)
  }
}

// Public API
module.exports = importEnv
