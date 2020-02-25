const { Role } = require('../../services/authorize/role')

const ruleBuilder = async (session) => {
  const anonRules = []

  const allRules = anonRules.slice(0)

  return {
    [Role.ANON]: anonRules,
    [Role.VOLUNTEER_PROVIDER]: allRules,
    [Role.OPPORTUNITY_PROVIDER]: allRules,
    [Role.ACTIVITY_PROVIDER]: allRules,
    [Role.ORG_ADMIN]: allRules,
    [Role.ADMIN]: allRules
  }
}

module.exports = ruleBuilder
