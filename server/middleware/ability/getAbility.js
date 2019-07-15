const glob = require('glob')
const { Ability } = require('@casl/ability')
const { Role } = require('../../services/auth/role')

module.exports = options => (req, res, next) => {
  const rootPath = require('path').join(__dirname, '/../../..')
  const pattern = rootPath + options.searchPattern
  const userRoles = req.session && req.session.me ? req.session.me.role : [Role.ANON]
  console.log('The call is from get ability')
  console.log('request session object has a value of ', req.session)
  let allRules = []
  glob.sync(pattern).forEach(abilityPath => {
    const ab = require(abilityPath)
    userRoles.forEach(role => {
      if (ab[role] == null) return
      // TODO: [VP-277] when concat roles we will get duplicates - use set.
      allRules = allRules.concat(ab[role])
    })
  })
  req.ability = new Ability(allRules)
  next()
}
