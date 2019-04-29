
const getAuth0 = (options) => {
  const { config } = require('../../config/config')
  const auth0 = require('auth0-js')
  return new auth0.WebAuth({
    clientID: config.auth.AUTH0_CLIENT_ID,
    domain: config.auth.AUTH0_CLIENT_DOMAIN
  })
}

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`

const getOptions = (container) => {
  return {
    responseType: 'token id_token',
    redirectUri: `${getBaseUrl()}/auth/signed-in`,
    scope: 'openid profile email'
  }
}

export const authorize = () => getAuth0().authorize(getOptions())
export const logout = () => getAuth0().logout({ returnTo: getBaseUrl() })
export const parseHash = (callback) => getAuth0().parseHash(callback)
