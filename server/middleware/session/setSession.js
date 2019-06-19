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

module.exports = async (req, res, next) => {
  req.session = DEFAULT_SESSION
  if (!isUrlBlacklisted(req.url) && req.cookies.idToken) {
    try {
      const user = jwtDecode(req.cookies.idToken)
      req.session.isAuthenticated = true
      req.session.user = user
      req.session.me = await Person.findOne({ email: req.session.user.email }).exec()
    } catch (err) {
      console.log(err)
    }
  }
  next()
}
