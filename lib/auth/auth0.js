import auth0 from 'auth0-js'

import { getBaseUrl } from '../urlUtil.js'
import { config } from '../../config/clientConfig.js'

const getAuth0 = (options) => {
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
