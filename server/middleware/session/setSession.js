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
  // console.log('Before assigning defualt session req.session has a value of ', req.session)
  // console.log('In set session the value of the cookie is ', req.cookies)
  req.session = { ...DEFAULT_SESSION } // Default session object will get mutated after logged in. Deconstructing the objec will only get the attribute of it
  console.log('In set session default session value is ', DEFAULT_SESSION)
  console.log('In set session req.session has a value of ', req.session)
  console.log('Before going to the condition if, the value of the request cookies is ', req.cookies.idToken)
  console.log('The checking result of isURL backlist is ', isUrlBlacklisted(req.url))
  console.log('\n')
  if (!isUrlBlacklisted(req.url) && req.cookies.idToken) {
    try {
      const user = jwtDecode(req.cookies.idToken)
      req.session.isAuthenticated = true
      req.session.user = user
      req.session.me = await Person.findOne({ email: req.session.user.email }).exec()
      console.log('There is a cookie from the request and a person is found')
    } catch (err) {
      console.log(err)
    }
  } else {
    console.log('No cookie found in the request object')
    console.log('The request cookie object has a value of ', req.cookies.idToken)
    console.log('\n')
  }
  next()
}
