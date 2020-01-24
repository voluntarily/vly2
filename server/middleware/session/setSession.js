const jwtDecode = require('jwt-decode')
const Person = require('../../api/person/person')

const DEFAULT_SESSION = {
  isAuthenticated: false,
  user: null,
  me: null
}

const URL_BLACKLIST = ['/static/', '/_next/']

const isUrlBlacklisted = url => {
  let blacklisted = false
  for (let i = 0; i < URL_BLACKLIST.length; i++) {
    if (url.includes(URL_BLACKLIST[i])) {
      blacklisted = true
      break
    }
  }
  return blacklisted
}

const getCookie = (req) => {
  if (req.cookies.idToken != null) {
    return req.cookies
  }
  return undefined
}

const hasSessionInQueryRequest = (req) => {
  return req.query != null && req.query.session != null
}

const setSession = async (req, res, next) => {
  console.log(req.query)
  req.session = { ...DEFAULT_SESSION } // Default session object will get mutated after logged in. Deconstructing the objec will only get the attribute of it
  const cookie = getCookie(req)

  if (hasSessionInQueryRequest(req)) {
    req.session = req.query.session
  }

  if (!isUrlBlacklisted(req.url) && cookie && cookie.idToken) {
    try {
      const user = jwtDecode(cookie.idToken)
      req.session.isAuthenticated = true
      req.session.user = user
      req.session.me = await Person.findOne({ email: req.session.user.email }).exec()
    } catch (err) {
      console.error('setSession', err)
    }
  }
  next()
}

module.exports = setSession
