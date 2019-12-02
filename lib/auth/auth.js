import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'
import callApi from '../callApi'

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

export const createPersonFromUser = async (user, cookies) => {
  const person = {
    name: user.name,
    email: user.email,
    nickname: user.nickname,
    imgUrl: user.picture
  }
  try {
    const newPerson = await callApi('people', 'post', person, cookies)
    return newPerson
  } catch (err) {
    console.error('create failed', err)
    return false
  }
}

export const getPersonFromUser = async (user, cookies) => {
  if (!user.email_verified) {
    console.error('Warning: user email not verified')
    // TODO: [VP-269] handle user email not verified state

    // return false
  }
  try {
    const query = {
      email: user.email
    }
    const person = await callApi(`people/?q=${JSON.stringify(query)}`, 'get', null, cookies)
    return person
  } catch (err) {
    console.log(err)
    const newPerson = await createPersonFromUser(user, cookies)
    return newPerson
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
