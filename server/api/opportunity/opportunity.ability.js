const { SchemaName, OpportunityStatus, OpportunityFields } = require('./opportunity.constants')
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
  const anonAbilities = [{
    subject: SchemaName,
    action: Action.READ,
    conditions: { status: OpportunityStatus.ACTIVE }
  }, {
    subject: SchemaName,
    action: Action.LIST,
    conditions: { status: OpportunityStatus.ACTIVE },
    fields: [OpportunityFields.ID, OpportunityFields.TITLE, OpportunityFields.SUBTITLE, OpportunityFields.IMG_URL, OpportunityFields.DURATION]
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

  const allAbilities = [{
    subject: SchemaName,
    action: Action.READ
  }, {
    subject: SchemaName,
    action: Action.LIST
  }]

  const vpAbilities = allAbilities
  const opAbilities = allAbilities.concat([{
    subject: SchemaName,
    action: Action.CREATE
  }, {
    subject: SchemaName,
    action: Action.UPDATE
  }])
  const testerAbilities = [{ subject: SchemaName, action: Action.MANAGE }]
  const adminAbilities = [{ subject: SchemaName, action: Action.MANAGE }]
  const orgAdminAbilities = [{ subject: SchemaName, action: Action.MANAGE }]

  return {
    [Role.ANON]: anonAbilities,
    [Role.VOLUNTEER_PROVIDER]: vpAbilities,
    [Role.OPPORTUNITY_PROVIDER]: opAbilities,
    [Role.TESTER]: testerAbilities,
    [Role.ADMIN]: adminAbilities,
    [Role.ORG_ADMIN]: orgAdminAbilities
  }
}

module.exports = ruleBuilder
