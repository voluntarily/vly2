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

module.exports = options => async (req, res, next) => {
  if (openPath(req.url)) {
    return next()
  }
  const rootPath = require('path').join(__dirname, '/../../..')
  const pattern = rootPath + options.searchPattern
  const userRoles = req.session && req.session.me ? req.session.me.role : [Role.ANON]
  let allRules = []

  for (const abilityRuleBuilderPath of glob.sync(pattern)) {
    const ruleBuilder = require(abilityRuleBuilderPath)
    const rules = await ruleBuilder(req.session)
    for (const role of userRoles) {
      if (rules[role] == null) continue
      if (role) {
        console.log(`Role ${role}`)
        allRules = allRules.concat(rules[role])
      }
      if (role === 'admin') break
    }
  }

  req.ability = new Ability(allRules)
  next()
}
