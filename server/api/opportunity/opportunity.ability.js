const { SchemaName, OpportunityStatus, OpportunityFields, OpportunityPublishedStatus } = require('./opportunity.constants')
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
    conditions: { status: OpportunityStatus.ACTIVE },
    fields: [OpportunityFields.ID, OpportunityFields.NAME, OpportunityFields.SUBTITLE, OpportunityFields.IMG_URL, OpportunityFields.DURATION, OpportunityFields.DATE]
  }, {
    subject: SchemaName,
    action: Action.LIST,
    conditions: { status: OpportunityStatus.ACTIVE },
    fields: [OpportunityFields.ID, OpportunityFields.NAME, OpportunityFields.SUBTITLE, OpportunityFields.IMG_URL, OpportunityFields.DURATION, OpportunityFields.DATE]
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

  const opAbilities = [{
    subject: SchemaName,
    action: Action.READ,
    conditions: { status: { $in: OpportunityPublishedStatus } }
  }, {
    subject: SchemaName,
    action: Action.READ,
    conditions: { requestor: session.me && session.me._id }
  }, {
    subject: SchemaName,
    action: Action.LIST
  }, {
    subject: SchemaName,
    action: Action.UPDATE,
    conditions: { requestor: session.me && session.me._id }
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.CREATE
  }]

  const testerAbilities = [{ subject: SchemaName, action: Action.MANAGE }]
  const adminAbilities = [{ subject: SchemaName, action: Action.MANAGE }]

  const orgAdminAbilities = [{
    subject: SchemaName,
    action: Action.READ
  }, {
    subject: SchemaName,
    action: Action.LIST
  }, {
    subject: SchemaName,
    action: Action.UPDATE,
    conditions: { offerOrg: { $in: session.me.orgAdminFor } }
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.CREATE
  }]

  return {
    [Role.ANON]: anonAbilities,
    [Role.VOLUNTEER_PROVIDER]: anonAbilities,
    [Role.OPPORTUNITY_PROVIDER]: opAbilities,
    [Role.TESTER]: testerAbilities,
    [Role.ADMIN]: adminAbilities,
    [Role.ORG_ADMIN]: orgAdminAbilities
  }
}

module.exports = ruleBuilder
