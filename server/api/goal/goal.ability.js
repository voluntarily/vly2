const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { SchemaName } = require('./goal.constants')

const ruleBuilder = session => {
  const anonAbilities = [{
    subject: SchemaName,
    action: Action.LIST
  }, {
    subject: SchemaName,
    action: Action.READ
  }, {
    subject: SchemaName,
    action: Action.CREATE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.UPDATE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }]

  const allAbilities = anonAbilities.slice(0)

  const adminAbilities = [{
    subject: SchemaName,
    action: Action.MANAGE
  }]

  return {
    [Role.ANON]: anonAbilities,
    [Role.VOLUNTEER]: allAbilities,
    [Role.OPPORTUNITY_PROVIDER]: allAbilities,
    [Role.ACTIVITY_PROVIDER]: allAbilities,
    [Role.ORG_ADMIN]: allAbilities,
    [Role.ADMIN]: adminAbilities
  }
}

module.exports = ruleBuilder
