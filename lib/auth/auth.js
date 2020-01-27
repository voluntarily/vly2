import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'
import { setSession as setSessionAction } from '../redux/actions'
import Person from '../../server/api/person/person'

export const parseTokenToSession = async (idToken) => {
  const user = jwtDecode(idToken)
  // TODO: validate token and put all token decodes together
  const me = await getPersonFromUser(user)
  return {
    isAuthenticated: !!user,
    user,
    me,
    idToken
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
    const person = await Person.findOne({ email: user.email }).exec()
    return person
  } catch (err) {
    console.error(`failed to find ${user.email} - creating new person`, err)
    return createPersonFromUser(user)
  }
}

// TODO: [SUP-49] move createPersonFromUser from auth to person.lib
export const createPersonFromUser = async (user) => {
  const person = {
    name: user.name,
    email: user.email,
    nickname: user.nickname,
    imgUrl: user.picture
  }
  try {
    const p = new Person(person)
    await p.save()
    return p
  } catch (err) {
    // will fail if email is a duplicate
    // console.error('create person failed', err)
    return false
  }
}

export const setToken = (idToken, accessToken) => {
  if (!process.browser) {
    return
  }
  // Cookie.set('user', jwtDecode(idToken))
  Cookie.set('idToken', idToken)
  Cookie.set('accessToken', accessToken)
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

export const getSession = async (req, store) => {
  // only use on server side - e.g getInitialProps
  // express setSession has converted the idToken to session in the req
  // copy into redux store and return for GetInitialProps
  if (req && req.session) {
    await store.dispatch(setSessionAction(req.session))
    return req.session
  }
  console.error('WARNING', 'session not set')
  return false
}
