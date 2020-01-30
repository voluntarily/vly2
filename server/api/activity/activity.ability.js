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

  const allAbilities = anonAbilities

  const adminAbilities = [{
    subject: SchemaName,
    action: Action.LIST
  }, {
    subject: SchemaName,
    action: Action.CREATE
  }, {
    subject: SchemaName,
    action: Action.READ
  }, {
    subject: SchemaName,
    action: Action.UPDATE
  }, {
    subject: SchemaName,
    action: Action.DELETE
  }]

  return {
    [Role.ANON]: anonAbilities,
    [Role.VOLUNTEER_PROVIDER]: allAbilities,
    [Role.OPPORTUNITY_PROVIDER]: allAbilities,
    [Role.ADMIN]: adminAbilities
  }
}

module.exports = ruleBuilder
