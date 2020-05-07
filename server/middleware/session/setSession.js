const Person = require('../../api/person/person')
const { PersonListFields, PersonFields } = require('../../api/person/person.constants')
const { Role } = require('../../services/authorize/role')
const { TOPIC_PERSON__CREATE } = require('../../services/pubsub/topic.constants')
const PubSub = require('pubsub-js')
const { TokenExpiredError } = require('jsonwebtoken')
const { jwtVerify } = require('./jwtVerify')
const { getPersonRoles } = require('../../api/member/member.lib')
const { isEmailVerified, setEmailVerified } = require('../../api/personalVerification/verified')
const { PersonalVerificationStatus } = require('../../api/personalVerification/personalVerification.constants')

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
    imgUrl: user.picture,
    topicGroups: [],
    verified: []
  }
  if (user.email_verified) {
    person.verified.push({ name: PersonFields.EMAIL, status: PersonalVerificationStatus.VERIFIED })
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
      // If this is an API request then return 401 unauthorized
      if (req.url.startsWith('/api/')) {
        return res.sendStatus(401)
      }

      // from a client side redirect
      if (req.url.startsWith('/auth/sign-thru')) {
        return next()
      }

      const encodedRedirectUrl = encodeURIComponent(req.url)

      // Have to set location and set-cookie header manually without nodejs helper functions (res.clearCookie, res.redirect)
      // as the above functions make the header immutable.
      // We must clear idToken cookie server-side otherwise we create a infinite loop of redirects as this code will be
      // executed again.
      res.setHeader(
        'Location',
        `/auth/sign-thru?redirect=${encodedRedirectUrl}`
      )
      res.setHeader(
        'Set-Cookie',
        'idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      )
      res.statusCode = 302
      return res.end()
    }

    user = false
  }
  if (!user) {
    return next()
  }
  req.session.idToken = idToken
  req.session.user = user

  let me = false
  try {
    me = await Person.findOne({ email: user.email }).exec()
    if (!me) {
      me = await createPersonFromUser(user)
    } else {
      if (user.email_verified && !isEmailVerified(me)) {
        await setEmailVerified(PersonalVerificationStatus.VERIFIED, user.email, me)
      }
      await getPersonRoles(me)
    }
  } catch (err) {
    console.error(`failed to find or create ${user.email}`, err)
  }

  req.session = {
    isAuthenticated: true, // user.email_verified,
    user,
    me,
    idToken
  }
  // console.log('setting session from IdToken', req.url, req.session.isAuthenticated, 'user', req.session.user.email, 'me', req.session.me.name, req.session.me.role)
  next()
}

module.exports = setSession
