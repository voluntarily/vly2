const jwtDecode = require('jwt-decode')
const Cookie = require('js-cookie')
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

const getCookieString = (req) => {
  if(req.cookies.idToken != null) { 
    return req.cookies
  } else if (req.headers.cookie != null) {
    let cookieInJSON
    req.headers.cookie = req.headers.cookie
    try{
      cookieInJSON = JSON.parse(req.headers.cookie)
    } catch(err) {
      console.log(err)
      return undefined
    }
    return cookieInJSON
  } else if( req.headers.cookie != null) {
    console.log('COOKIE')
  } 
  return undefined
}

module.exports = async (req, res, next) => {
  req.session = {...DEFAULT_SESSION} // Default session object will get mutated after logged in. Deconstructing the objec will only get the attribute of it
  const cookieString = getCookieString(req)

  if ( !isUrlBlacklisted(req.url) && cookieString != null) {
    try {
      const user = jwtDecode(cookieString.idToken)
      req.session.isAuthenticated = true
      req.session.user = user
      req.session.me = await Person.findOne({ email: req.session.user.email }).exec()
    } catch (err) {
      console.log(err)
    }
  } 

  if(!req.path.match(/_next/)){
    console.log('\nSET session middleware\n')
  }
  next()
}
