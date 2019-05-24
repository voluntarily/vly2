import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'
import callApi from '../apiCaller'

// TODO save for parsing the query to get the redirect

// const getQueryParams = () => {
//   const params = {}
//   window.location.href.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
//     params[$1] = $3
//   })
//   return params
// }

export const setToken = (idToken, accessToken) => {
  if (!process.browser) {
    return
  }
  Cookie.set('user', jwtDecode(idToken))
  Cookie.set('idToken', idToken)
  Cookie.set('accessToken', accessToken)
}

export const getPersonFromUser = (user) => {
  console.log('getPersonFromUser', user)
  if (!user.email_verified) {
    console.log('Warning: user email not verified')
    return null
  }
  return callApi(`person/by/email/${user.email}`)
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
