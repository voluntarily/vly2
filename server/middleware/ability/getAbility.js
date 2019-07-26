const glob = require('glob')
const { Ability } = require('@casl/ability')
const { Role } = require('../../services/auth/role')

module.exports = options => (req, res, next) => {
  const rootPath = require('path').join(__dirname, '/../../..')
  const pattern = rootPath + options.searchPattern
  const userRoles = req.session && req.session.me ? req.session.me.role : [Role.ANON]
  let allRules = []
  glob.sync(pattern).forEach(abilityRuleBuilderPath => {
    const ruleBuilder = require(abilityRuleBuilderPath)
    const rules = ruleBuilder(req.session)
    userRoles.forEach(role => {
      if (rules[role] == null) return
      // TODO: [VP-277] when concat roles we will get duplicates - use set.
      allRules = allRules.concat(rules[role])
    })
  })
  req.ability = new Ability(allRules)
  next()
}
