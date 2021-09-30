import nodecipher from 'node-cipher'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import rimraf from 'rimraf'

// importEnv(path?, secret?)
// This will decrypt using node-cipher and import environment variables using dotenv.
//
// path is an optional variable and will default to process.env.ENV_PATH
// secret is an optional variable and will default to process.env.ENV_SECRET
export const importEnv = (envName = process.env.ENV_ENVIRONMENT, secret = process.env.ENV_SECRET) => {
  if (envName && secret) {
    const input = `${envName}.env.enc`
    const output = `${envName}.env`

    nodecipher.decryptSync({
      input,
      output,
      password: secret
    })

    const myEnv = dotenv.config({ path: output })
    dotenvExpand(myEnv)
    rimraf.sync(output)

    return myEnv.parsed
  } else {
    console.warn(`
    ENV_ENVIRONMENT and/or ENV_SECRET haven't been defined as environment variables and so we won't parse an encrypted environment file.
    Please make sure to pass all required environment variables for the application, otherwise may get errors and unexpected behaviour.
    `)

    return {}
  }
}
export default importEnv
