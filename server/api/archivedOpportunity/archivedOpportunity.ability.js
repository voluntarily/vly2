const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { SchemaName } = require('./archivedOpportunity.constants')
const { OpportunityStatus, OpportunityFields } = require('../opportunity/opportunity.constants')

const ruleBuilder = session => {
  const anonAbilities = [{
    subject: SchemaName,
    action: Action.LIST,
    conditions: { status: { $in: [OpportunityStatus.COMPLETED] } },
    fields: [OpportunityFields.ID, OpportunityFields.NAME, OpportunityFields.SUBTITLE, OpportunityFields.IMG_URL, OpportunityFields.DURATION, OpportunityFields.STATUS]
  }, {
    subject: SchemaName,
    action: Action.READ,
    conditions: { status: { $in: [OpportunityStatus.COMPLETED] } },
    fields: Object.values(OpportunityFields)
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
    action: Action.LIST,
    fields: [OpportunityFields.ID, OpportunityFields.NAME,
      OpportunityFields.SUBTITLE, OpportunityFields.IMG_URL,
      OpportunityFields.DURATION, OpportunityFields.STATUS,
      OpportunityFields.DATE, OpportunityFields.LOCATION
    ]
  }, {
    subject: SchemaName,
    action: Action.READ,
    fields: Object.values(OpportunityFields)
  }, {
    subject: SchemaName,
    action: Action.CREATE
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
    [Role.ACTIVITY_PROVIDER]: allAbilities,
    [Role.ORG_ADMIN]: allAbilities,
    [Role.ADMIN]: adminAbilities
  }
}

module.exports = ruleBuilder
