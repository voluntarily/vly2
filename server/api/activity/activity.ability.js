const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { ActivityStatus, SchemaName } = require('./activity.constants')

const ruleBuilder = session => {
  const anonAbilities = [{
    subject: SchemaName,
    action: Action.LIST,
    conditions: { status: ActivityStatus.ACTIVE }
  }, {
    subject: SchemaName,
    action: Action.CREATE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.READ,
    conditions: { status: ActivityStatus.ACTIVE }
  }, {
    subject: SchemaName,
    action: Action.UPDATE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }]

  return {
    [Role.ANON]: anonAbilities,
    [Role.ALL]: anonAbilities
  }
}

module.exports = ruleBuilder
