// envHasKey is a local utility function used to check if the environment variable has been defined
const envHasKey = (key) => Object.prototype.hasOwnProperty.call(process.env, key)

// parseVar is a local utility function utilised in checkEnvVars to parse the input variables
const parseVar = (type, arg) => {
  if (typeof (arg) === 'string') {
    return arg.split(/\s/)
  } else if (Array.isArray(arg)) {
    return arg
  } else {
    console.error(`Unexpected type for input \`${type}\` to checkEnvVars. Expected a string or an array.`)
  }
}

// checkEnvVars(opts)
// This will throw an error if required environment variables are not defined,
// and log a warning for optional variables that are missing.
//
// opts = { required, optional }
// Both required and optional can be undefined, a string, or an array of strings.
const checkEnvVars = ({ required, optional }) => {
  if (Object.entries(process.env).length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Unable to checkEnvVars in frontend')
    }
    return
  }
  const requiredEnv = parseVar('required', required)
  const optionalEnv = parseVar('optional', optional)

  if (requiredEnv) {
    const unsetEnvs = requiredEnv.filter(key => !envHasKey(key))
    if (unsetEnvs.length > 0) {
      throw new Error('Required ENV variables are not set: [' + unsetEnvs.join(', ') + ']')
    }
  }
  if (optionalEnv) {
    const unsetEnvs = optionalEnv.filter(key => !envHasKey(key))
    if (unsetEnvs.length > 0) {
      console.warn(`
      Optional ENV variables are not set: [${unsetEnvs.join(', ')}].
      Hardcoded defaults will be utilised instead for these variables.
      `)
    }
  }
}

// Public API
module.exports = {
  checkEnvVars,
  envHasKey
}
