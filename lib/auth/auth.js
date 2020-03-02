import Cookie from 'js-cookie'
import { setSession as setSessionAction } from '../redux/actions'
import jwtDecode from 'jwt-decode'
import callApi from '../callApi'
import { Role } from '../../server/services/authorize/role'
import moment from 'moment'
import { getBaseUrl } from './auth0'

export const DEFAULT_SESSION = {
  isAuthenticated: false,
  user: null,
  me: {
    role: [Role.ANON]
  },
  idToken: ''
}

export const setToken = (idToken, accessToken) => {
  // if (!process.browser) {
  //   return
  // }
  Cookie.set('idToken', idToken)
  Cookie.set('accessToken', accessToken)
}

export const unsetToken = () => {
  Cookie.remove('idToken')
  Cookie.remove('accessToken')
}

export const getPersonFromUser = async (user, cookies) => {
  try {
    const query = encodeURIComponent(JSON.stringify({ email: user.email }))
    const person = await callApi(`people/?q=${query}`, 'get', null, cookies)
    return person
  } catch (err) {
    // should not fail as new person would get created from idToken
    // console.error('getPersonFromUser Error', err)
    return false
  }
}

// get session from cookies
export const getSessionFromCookies = async () => {
  const idToken = Cookie.getJSON('idToken')
  if (!idToken) return DEFAULT_SESSION

  const user = jwtDecode(idToken)
  const isAuthenticated = user && user.email_verified

  const session = {
    ...DEFAULT_SESSION,
    isAuthenticated,
    idToken,
    user
  }

  // Check if token is valid on client side.
  // this may happen if the users token expires while the are navigating between pages
  // that nextJS renders on the client side.
  const jwtValid = isJwtExpValid(user)
  if (!jwtValid) {
    const path = window.location.pathName
    const search = window.location.search
    const fragment = window.location.hash
    const redirectUrl = encodeURIComponent(path + search + fragment)
    window.location.replace(`${getBaseUrl()}/auth/sign-thru?redirect=${redirectUrl}`)
    return
  }

  if (isAuthenticated) {
    session.me = await getPersonFromUser(user, Cookie.get())
  }
  return session
}

// returns a boolean indicating whether the tokens expiry time is still valid
export const isJwtExpValid = (user) => {
  const expiry = user.exp
  const now = moment().utc().unix()
  return now - expiry < 0
}

export const getSession = async (req, store) => {
  // on server side express setSession has converted the idToken to session in the req
  // on client side init from cookie idToken
  // copy into redux store and return for GetInitialProps
  const session = (req && req.session) ? req.session : await getSessionFromCookies()
  // save the results in store and props
  await store.dispatch(setSessionAction(session))
  return session
}
