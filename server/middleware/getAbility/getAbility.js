const glob = require('glob')
const { Ability } = require('@casl/ability')
const { Role } = require('../../services/auth/role')

module.exports = options => (req, res, next) => {
  // console.log('getAbility req.session', req.session)
  const rootPath = require('path').join(__dirname, '/../../..')
  const pattern = rootPath + options.searchPattern
  // console.log('getAbility pattern', pattern)
  const userRoles = req.session && req.session.me ? req.session.me.role : [Role.ANON]
  // console.log('getAbility userRoles', userRoles)
  let allRules = []
  glob.sync(pattern).forEach(abilityPath => {
    // console.log('getAbility abilityPath', abilityPath)
    userRoles.forEach(role => {
      const rules = require(abilityPath)[role]
      // console.log('getAbility rules', rules)
      allRules = allRules.concat(rules)
    })
  })
  req.ability = new Ability(allRules)
  // console.log('getAbility req.ability', req.ability)
  next()
}
