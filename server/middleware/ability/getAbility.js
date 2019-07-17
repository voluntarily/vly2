const glob = require('glob')
const { Ability } = require('@casl/ability')
const { Role } = require('../../services/auth/role')

module.exports = options => (req, res, next) => {
  const rootPath = require('path').join(__dirname, '/../../..')
  const pattern = rootPath + options.searchPattern
  const userRoles = req.session && req.session.me ? req.session.me.role : [Role.ANON]

  if(!req.path.match(/_next/g) && !req.path.match(/static/g)){
    console.log('From get ability request session is authenticated? ', req.session.isAuthenticated)
    console.log('The request url path is ', req.path)
    if (req.path.match('/api/people')){
      console.log('The request object has cookies in the get ability for /api/people request ? ', req.cookies != null)
      console.log('The request object has session object in the get ability for /api/people request ? ', req.session != null)
    }
  }
  let allRules = []
  glob.sync(pattern).forEach(abilityPath => {
    const ab = require(abilityPath)
    userRoles.forEach(role => {
      if (ab[role] == null) return
      // TODO: [VP-277] when concat roles we will get duplicates - use set.
      allRules = allRules.concat(ab[role])
    })
  })

  if(!req.path.match(/_next/g) && !req.path.match(/static/g)){
    console.log('Finish finding rules')
    console.log('The rules found is ', allRules)
    console.log('\n')
  }

  req.ability = new Ability(allRules) 
  next()
}
