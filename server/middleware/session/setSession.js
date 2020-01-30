const Person = require('../../api/person/person')
const { Role } = require('../../services/authorize/role')
const { TOPIC_PERSON__CREATE } = require('../../services/pubsub/topic.constants')
const PubSub = require('pubsub-js')
const { jwtVerify } = require('./jwtVerify')

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

  if (req.headers.authentication) {
    const regex = /Bearer (.*)/
    const found = req.headers.authentication.match(regex)
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
    // will fail if email is a duplicate
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
    // TODO: fully validate the token
  } catch (e) {
    console.error('Jwt Verify failed', e)
    user = false
  }
  if (!user) {
    return next()
  }
  req.session.idToken = idToken
  req.session.user = user
  if (!user.email_verified) {
    console.error('setSession Warning: user email not verified')
    return next()
  }
  // TODO: validate token and put all token decodes together
  let me = false
  try {
    me = await Person.findOne({ email: user.email }).exec()
    if (!me) {
      // console.error(`failed to find ${user.email} - creating new person`)
      me = await createPersonFromUser(user)
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
  // console.log('setting session from IdToken', req.url, req.session.isAuthenticated, 'user', req.session.user.email, 'me', req.session.me.name)
  next()
}

module.exports = setSession
