const { SchemaName } = require('./organisation.constants')
const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')

/*
// TypeScript definition
interface Rule {
  actions: string | string[],
  subject: string | string[],
  conditions?: Object,
  fields?: string[],
  inverted?: boolean, // default is `false`
  reason?: string // mainly to specify why user can't do something. See forbidden reasons for details
}
*/

const ruleBuilder = (session) => {
  const defaultAbilities = [{
    subject: SchemaName,
    action: Action.READ
  }, {
    subject: SchemaName,
    action: Action.LIST
  }, {
    subject: SchemaName,
    action: Action.UPDATE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.CREATE,
    inverted: true
  }]

  const adminAbilities = [{
    subject: SchemaName,
    action: Action.MANAGE
  }]

  return {
    [Role.ANON]: defaultAbilities,
    [Role.BASIC]: defaultAbilities,
    [Role.VOLUNTEER]: defaultAbilities,
    [Role.ACTIVITY_PROVIDER]: defaultAbilities,
    [Role.OPPORTUNITY_PROVIDER]: defaultAbilities,
    [Role.SUPPORT]: defaultAbilities,
    // ORG_ADMIN roles are further trimmed in each Controller Action
    [Role.ORG_ADMIN]: adminAbilities,
    [Role.ADMIN]: adminAbilities
  }
}

module.exports = ruleBuilder
