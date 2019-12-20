import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'
import callApi from '../callApi'
import { setSession } from '../redux/actions'

export const parseTokenToSession = async (idToken) => {
  const user = jwtDecode(idToken)
  return parseUserToSession(user)
}

export const parseUserToSession = async (user, cookies) => {
  const me = await getPersonFromUser(user, cookies)
  return {
    isAuthenticated: !!user,
    user,
    me
  }
}

export const setToken = (idToken, accessToken) => {
  if (!process.browser) {
    return
  }
  Cookie.set('user', jwtDecode(idToken))
  Cookie.set('idToken', idToken)
  Cookie.set('accessToken', accessToken)
}

// TODO: [SUP-49] move createPersonFromUser from auth to person.lib
export const createPersonFromUser = async (user, cookies) => {
  const person = {
    name: user.name,
    email: user.email,
    nickname: user.nickname,
    imgUrl: user.picture
  }
  try {
    return await callApi('people', 'post', person, cookies)
  } catch (err) {
    console.error('create failed', err)
    return false
  }
}

export const getPersonFromUser = async (user, cookies) => {
  if (!user.email_verified) {
    console.error('Warning: user email not verified')
    // TODO: [VP-269] handle user email not verified state
    // publish notice so goal card gets added.
    // return false
  }
  try {
    const query = {
      email: user.email
    }
    const person = await callApi(`people/?q=${JSON.stringify(query)}`, 'get', null, cookies)
    return person
  } catch (err) {
    // here if we get 403 forbidden - which indicates the person doesn't exist yet.
    return createPersonFromUser(user, cookies)
  }
}

export const unsetToken = () => {
  if (!process.browser) {
    return
  }
  Cookie.remove('idToken')
  Cookie.remove('accessToken')
  Cookie.remove('user')

  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now())
}

export const getUserFromServerCookie = (req) => {
  if (!req.headers.cookie) {
    return undefined
  }
  const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('idToken='))
  if (!jwtCookie) {
    return undefined
  }
  const jwt = jwtCookie.split('=')[1]
  return jwtDecode(jwt)
}

export const getUserFromLocalCookie = () => {
  return Cookie.getJSON('user')
}

export const getSession = async (req, store) => {
  const cookies = req ? req.cookies : Cookie.get()
  let session = {
    isAuthenticated: false,
    me: false
  }
  const loggedUser = process.browser
    ? getUserFromLocalCookie()
    : getUserFromServerCookie(req)
  if (loggedUser) {
    try {
      session = await parseUserToSession(loggedUser, cookies)
      store.dispatch(setSession(session))
    } catch (err) {
      console.error('Auth error parsing user session: ', err)
    }
  }
  return session
}
