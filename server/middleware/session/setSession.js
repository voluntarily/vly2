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


module.exports = async (req, res, next) => {
  // console.log('Before assigning defualt session req.session has a value of ', req.session)
  // console.log('In set session the value of the cookie is ', req.cookies)
  req.session = {...DEFAULT_SESSION} // Default session object will get mutated after logged in. Deconstructing the objec will only get the attribute of it
  
  if (!req.url.match(/_next/g) && !req.url.match(/static/g)){
    console.log('\nIn set session middleware ')
    console.log('The request has url: ', req.path)
    console.log('There is idToken cookies in the request ? ', req.cookies.idToken != null)
    // console.log(getUserFromLocalCookie)
    // Potental solution could be add session into request object payload in personlist page
    // TODO: learn how to add session object into get method in person list page
  }
  if (!isUrlBlacklisted(req.url) && req.cookies.idToken) {
    try {
      const user = jwtDecode(req.cookies.idToken)
      req.session.isAuthenticated = true
      req.session.user = user
      req.session.me = await Person.findOne({ email: req.session.user.email }).exec()
      if (!req.url.match(/_next/g) && !req.url.match(/static/g)){
        console.log("\x1b[42m",'Found cookies')
        console.log("\x1b[0m")
      }
    } catch (err) {
      console.log(err)
    }
  } else {
    if (!req.url.match(/_next/g) && !req.url.match(/static/g)){
      console.log("\x1b[41m" ,'No cookie found in the request object')
      console.log('The request object has cookies idToken value ? ', req.cookies.idToken != null)
      console.log('The request param  is ', req.params)
      console.log('Reading cookie from local storage is ' , Cookie.getJSON('user'))
      console.log('\n')
      console.log("\x1b[0m")
    }
  }

  if (!req.url.match(/_next/g) && !req.url.match(/static/g)){
    console.log('Going to the next middleware in set session\n')
  }
  next()
}
