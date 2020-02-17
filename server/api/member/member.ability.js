const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { SchemaName } = require('./member.constants')

const ruleBuilder = async (session) => {
  const anonRules = [{
    subject: SchemaName,
    action: Action.MANAGE,
    inverted: true
  }]

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
