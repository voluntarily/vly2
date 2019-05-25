import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'
import callApi from '../apiCaller'

export const parseTokenToSession = (idToken, accessToken) => {
  if (!process.browser) {
    return
  }

  const user = jwtDecode(idToken)
  const person = createPersonFromUser(user)

  return {
    isAuthenticated: !!user,
    user,
    person,
    idToken,
    accessToken
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

export const createPersonFromUser = async (user) => {
  console.log('createPersonFromUser')
  const person = {
    name: user.name,
    email: user.email,
    nickname: user.nickname,
    avatar: user.picture
  }
  try {
    const newPerson = await callApi('people', 'post', person)
    console.log('created person', newPerson)
    return newPerson
  } catch (err) {
    console.log('create failed', err)
    return false
  }
}

export const getPersonFromUser = async (user) => {
  console.log('getPersonFromUser', user.email)
  if (!user.email_verified) {
    console.log('Warning: user email not verified')
    return false
  }
  try {
    const person = await callApi(`person/by/email/${user.email}`)
    console.log('got person', person)
    return person
  } catch (err) {
    console.log('did not get person, creating...')
    const newPerson = await createPersonFromUser(user)
    console.log('newPerson', newPerson)
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
