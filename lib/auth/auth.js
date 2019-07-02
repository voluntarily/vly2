import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'
import callApi from '../apiCaller'

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
  // console.log('createPersonFromUser')
  const person = {
    name: user.name,
    email: user.email,
    nickname: user.nickname,
    avatar: user.picture
  }
  try {
    const newPerson = await callApi('people', 'post', person, cookies)
    // console.log('created person', newPerson)
    return newPerson
  } catch (err) {
    // console.log('create failed', err)
    return false
  }
}

export const getPersonFromUser = async (user, cookies) => {
  // console.log('getPersonFromUser', user.email)
  if (!user.email_verified) {
    console.log('Warning: user email not verified')
    // TODO: handle user email not verified state

    // return false
  }
  try {
    const person = await callApi(`person/by/email/${user.email}`, 'get', null, cookies)
    // console.log('got person', person)
    return person
  } catch (err) {
    // console.log('did not get person, creating...')
    const newPerson = await createPersonFromUser(user, cookies)
    // console.log('newPerson', newPerson)
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
