const glob = require('glob')
const { Ability } = require('@casl/ability')
const { Role } = require('../../services/authorize/role')

// list paths for which ability is not required
const OPEN_URL = ['/static/', '/_next/']

const openPath = url => {
  let path
  for (path of OPEN_URL) {
    if (url.startsWith(path)) {
      return true
    }
  }
  return false
}

module.exports = options => (req, res, next) => {
  if (openPath(req.url)) {
    return next()
  }
  const rootPath = require('path').join(__dirname, '/../../..')
  const pattern = rootPath + options.searchPattern
  const userRoles = req.session && req.session.me ? req.session.me.role : [Role.ANON]
  let allRules = []
  glob.sync(pattern).forEach(abilityRuleBuilderPath => {
    const ruleBuilder = require(abilityRuleBuilderPath)
    const rules = ruleBuilder(req.session, req.query)
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
