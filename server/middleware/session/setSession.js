const jwtDecode = require('jwt-decode')
const Person = require('../../api/person/person')
const { Role } = require('../../services/authorize/role')

const DEFAULT_SESSION = {
  isAuthenticated: false,
  user: null,
  me: {
    role: [Role.ANON]
  },
  idToken: ''
}

/* when page loads it makes lots of static and library calls
 we don't need to authenticate or set session for these items
 */
const OPEN_URL = ['/static/', '/_next/']

const openPath = url => {
  // console.log('openPath', url)
  let path
  for (path of OPEN_URL) {
    if (url.startsWith(path)) {
      return true
    }
  }
  return false
}

/* Get the current Authentication Token from either the cookies or the headers */
const getIdToken = (req) => {
  if (req && req.cookies && req.cookies.idToken) { return req.cookies.idToken }

  if (req.headers.authentication) {
    const regex = /Bearer (.*)/
    const found = req.headers.authentication.match(regex)
    return found[1]
  }
}

const setSession = async (req, res, next) => {
  req.session = { ...DEFAULT_SESSION } // Default session object will get mutated after logged in. Deconstructing the objec will only get the attribute of it
  if (openPath(req.url)) {
    // skip if its a special path.
    return next()
  }

  const idToken = getIdToken(req)
  if (!idToken) {
    return next()
  }

  if (idToken) {
    try {
      const user = jwtDecode(idToken)
      // TODO: must validate as well as decode the token
      req.session.isAuthenticated = true
      req.session.user = user
      const me = await Person.findOne({ email: req.session.user.email }).exec()
      me._id = me._id.toString()
      req.session.me = me.toJSON()
      req.session.idToken = idToken
    } catch (err) {
      console.error('setSession', err)
    }
  }
  // console.log('setting session from IdToken', req.url, req.session.isAuthenticated, 'user', req.session.user.email, 'me', req.session.me.name)
  next()
}

module.exports = setSession
