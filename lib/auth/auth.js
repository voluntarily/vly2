/** Client side authorisation checks and session setup */
import Cookie from 'js-cookie'
import moment from 'moment'
import { setSession as setSessionAction } from '../redux/actions'
import { getPathAndHash } from '../urlUtil'

export const setToken = (idToken, accessToken) => {
  Cookie.set('idToken', idToken)
  Cookie.set('accessToken', accessToken)
}

export const unsetToken = () => {
  Cookie.remove('idToken')
  Cookie.remove('accessToken')
}

/**
 * Takes a exp time from a JWT and returns if it has not expired.
 * @param {number} exp Expiration time claim from a JWT
 * @returns {boolean} returns true if the token is valid
 */
export const isJwtExpValid = exp => {
  return moment() < moment.unix(exp)
}

/**
 * Client side check for expired idToken.
 * called as we make page changes using Link.
 * This may happen if the users token expires while
 * navigating between pages that are not server side rendered.
 *
 * NOTE: This does not check if the token has been signed by the correct signing key
 * we do not need to verify the JWT on the client side as if an attacker were forging a signed JWT
 * the server will reject all API and page load requests.
 */
export const signInIfSessionExpired = async (user) => {
  if (!isJwtExpValid(user.exp)) {
    const redirectUrl = encodeURIComponent(getPathAndHash())
    const signThruUrl = `/auth/sign-thru?redirect=${redirectUrl}`
    window.location.replace(signThruUrl)
  }
}

/**
 * returns the session to the app GetInitialProps
 * server side the express setSession has converted the idToken
 * to session in the req so copy into redux store to be sent to the client.
 * on client side get from Redux store and return after checking expiry
 * @param {*} req - request (Server side)
 * @param {*} store - redux store (both)
 */
export const getSession = async (req, store) => {
  if (req && req.session) { // server side
    // console.log('getSession server side', req.url, req.session)
    await store.dispatch(setSessionAction(req.session))
    return req.session
  } else {
    const session = store.getState().session
    session.user && signInIfSessionExpired(session.user)
    return session
  }
}
