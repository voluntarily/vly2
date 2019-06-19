const glob = require('glob')
const { Ability } = require('@casl/ability')
const { Roles } = require('../../services/auth/role')

module.exports = (req, res, next) => {
  const rootPath = require('path').join(__dirname, '/../../..')
  const userRoles = req.session ? req.session.me.role : [Roles.ANON]
  let allRules = []
  glob.sync(rootPath + '/server/api/**/*.ability.js').forEach(abilityPath => {
    userRoles.forEach(role => {
      const rules = require(abilityPath)[role]
      allRules = allRules.concat(rules)
    })
  })
  req.ability = new Ability(allRules)
  next()
}
