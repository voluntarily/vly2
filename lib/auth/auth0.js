
import { getBaseUrl } from '../urlUtil'

const getAuth0 = (options) => {
  const { config } = require('../../config/clientConfig')
  const auth0 = require('auth0-js')
  return new auth0.WebAuth({
    clientID: config.auth.AUTH0_CLIENT_ID,
    domain: config.auth.AUTH0_CLIENT_DOMAIN
  })
}

const getOptions = (options) => {
  let opts = {
    responseType: 'token id_token',
    redirectUri: `${getBaseUrl()}/auth/signed-in?r=${options.redirectUrl}`,
    scope: 'openid profile email'
  }
  if (options.screen_hint) {
    opts = { ...opts, screen_hint: options.screen_hint }
  }
  return opts
}

export const authorize = (options) => getAuth0().authorize(getOptions(options))
export const logout = () => getAuth0().logout({ returnTo: getBaseUrl() })
export const parseHash = (callback) => getAuth0().parseHash(callback)
