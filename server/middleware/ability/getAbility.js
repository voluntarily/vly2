const glob = require('glob')
const { Ability } = require('@casl/ability')
const { Role } = require('../../services/auth/role')

module.exports = options => (req, res, next) => {
  const rootPath = require('path').join(__dirname, '/../../..')
  const pattern = rootPath + options.searchPattern
  const userRoles = req.session && req.session.me ? req.session.me.role : [Role.ANON]
  let allRules = []
  glob.sync(pattern).forEach(abilityPath => {
    const ab = require(abilityPath)
    userRoles.forEach(role => {
      if (ab[role] == null) return
      // TODO: [VP-277] when concat roles we will get duplicates - use set.
      allRules = allRules.concat(ab[role])
    })
  })

  if(!req.path.match(/_next/) && !req.path.match(/static/)){
    console.log('\nGET ABILITY got called ')
    if (!req.session.isAuthenticated) {
      console.log('REQUEST from path : ', req.path)
      console.log('Is cookie in header not empty ? ', req.headers.cookie != null)
      console.log('Is authorization in header not empty ? ', req.headers.authorization != null)
    }
    console.log('The rules from req object is ', allRules)
    console.log('\n\n')
  }
  req.ability = new Ability(allRules) 
  next()
}
