const glob = require('glob')
const { Ability } = require('@casl/ability')
const { Role } = require('../../services/authorize/role')

module.exports = options => (req, res, next) => {
  const rootPath = require('path').join(__dirname, '/../../..')
  const pattern = rootPath + options.searchPattern
  const userRoles = req.session && req.session.me ? req.session.me.role : [Role.ANON]
  let allRules = []
  glob.sync(pattern).forEach(abilityRuleBuilderPath => {
    const ruleBuilder = require(abilityRuleBuilderPath)
    const rules = ruleBuilder(req.session)
    for (const role of userRoles) {
      if (rules[role] == null) continue
      if (role) {
        allRules = allRules.concat(rules[role])
      }
      if (role === 'admin') break
    }
  })
  req.ability = new Ability(allRules)
  next()
}
