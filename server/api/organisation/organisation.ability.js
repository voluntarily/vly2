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

const ruleBuilder = session => {
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

  const orgAdminAbilities = [{
    subject: SchemaName,
    action: Action.READ
  }, {
    subject: SchemaName,
    action: Action.LIST
  }, {
    subject: SchemaName,
    action: Action.UPDATE
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.CREATE,
    inverted: true
  }]

  return {
    [Role.ANON]: defaultAbilities,
    [Role.VOLUNTEER_PROVIDER]: defaultAbilities,
    [Role.OPPORTUNITY_PROVIDER]: defaultAbilities,
    [Role.TESTER]: defaultAbilities,
    [Role.ADMIN]: adminAbilities,
    [Role.ORG_ADMIN]: orgAdminAbilities
  }
}

module.exports = ruleBuilder
