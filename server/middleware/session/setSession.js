const Person = require('../../api/person/person')
const { Role } = require('../../services/authorize/role')

const { TOPIC_PERSON__CREATE } = require('../../services/pubsub/topic.constants')
const PubSub = require('pubsub-js')
const queryString = require('querystring')
const { TokenExpiredError } = require('jsonwebtoken')
const { jwtVerify } = require('./jwtVerify')
const { getPersonRoles } = require('../../api/member/member.lib')
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

  if (req.headers.authorization) {
    const regex = /Bearer (.*)/
    const found = req.headers.authorization.match(regex)
    return found[1]
  }
}

const createPersonFromUser = async (user) => {
  const person = {
    name: user.name,
    email: user.email,
    nickname: user.nickname,
    imgUrl: user.picture
  }
  try {
    const p = new Person(person)
    await p.save()
    PubSub.publish(TOPIC_PERSON__CREATE, p)
    return p
  } catch (err) {
    // will fail if email is a duplicate or database gone
    console.error('create person failed', err)
    return false
  }
}

const setSession = async (req, res, next) => {
  req.session = { ...DEFAULT_SESSION } // Default session object will get mutated after logged in. Deconstructing the objec will only get the attribute of it
  if (openPath(req.url)) { // skip if its a special path.
    return next()
  }

  const idToken = getIdToken(req)
  if (!idToken) { // no token, use default session
    return next()
  }
  let user
  try {
    user = await jwtVerify(idToken)
  } catch (e) {
    // console.error('Jwt Verify failed', e)

    if (e instanceof TokenExpiredError) {
      // Don't redirect user to an /api/ path if token is expred
      // otherwise after signing through they will be treated with a nice wall of json.
      // Should only happen if the access token expires while ajax is being exectued on a page.
      // Unlikely to happen due to the client side token expiry check in getSession.
      const redirectUrl = req.originalUrl.startsWith('/api/') ? '/home/' : req.originalUrl

      const qs = queryString.stringify({ redirect: redirectUrl })
      // Can't use res.clearCookie or res.redirect functions together
      // they both set HEAD to be finished in express.

      // Have to set location and set-cookie header manually.

      // Must clear idToken header otherwise we create a infinite loop of redirects since next page load
      // will throw the same TokenExpiredError
      res.setHeader('Location', `/auth/sign-thru?${qs}`)
      res.setHeader('Set-Cookie', 'idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;')
      res.statusCode = 301
      res.end()
      return
    }

    user = false
  }
  if (!user) {
    return next()
  }
  req.session.idToken = idToken
  req.session.user = user
  if (!user.email_verified) {
    // remove login token here
    // console.error('setSession Warning: user email not verified')
    return next()
  }
  let me = false
  try {
    me = await Person.findOne({ email: user.email }, 'name nickname email role imgUrlSm sendEmailNotifications').exec()
    if (!me) {
      me = await createPersonFromUser(user)
    } else {
      await getPersonRoles(me)
    }
  } catch (err) {
    console.error(`failed to find or create ${user.email}`, err)
  }
  req.session = {
    isAuthenticated: user.email_verified,
    user,
    me,
    idToken
  }
  // console.log('setting session from IdToken', req.url, req.session.isAuthenticated, 'user', req.session.user.email, 'me', req.session.me.name, req.session.me.role)
  next()
}

module.exports = setSession
