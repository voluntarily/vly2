const glob = require('glob')
const { Ability } = require('@casl/ability')
const { Role } = require('../../services/auth/role')

module.exports = options => (req, res, next) => {
  const rootPath = require('path').join(__dirname, '/../../..')
  const pattern = rootPath + options.searchPattern
  const userRoles = req.session && req.session.me ? req.session.me.role : [Role.ANON]
  let allRules = []
  glob.sync(pattern).forEach(abilityPath => {
    userRoles.forEach(role => {
      const rules = require(abilityPath)[role]
      allRules = allRules.concat(rules)
    })
  })
  req.ability = new Ability(allRules)
  next()
}
