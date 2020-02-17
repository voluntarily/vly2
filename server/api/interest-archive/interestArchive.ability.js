const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { SchemaName } = require('./interestArchive.constants')
const ArchivedOpportunity = require('../archivedOpportunity/archivedOpportunity')

const ruleBuilder = async (session) => {
  const anonRules = [{
    subject: SchemaName,
    action: Action.MANAGE,
    inverted: true
  }]

  const allRules = anonRules.slice(0)

  const opportunityProviderRules = []

  if (session.me && session.me._id && session.me.role.includes(Role.OPPORTUNITY_PROVIDER)) {
    const myArchivedOpportunities = await ArchivedOpportunity.find({ requestor: session.me._id })
    const myArchivedOpportunityIds = myArchivedOpportunities.map(opportunity => opportunity._id.toString())

    opportunityProviderRules.push({
      subject: SchemaName,
      action: Action.LIST,
      conditions: { opportunity: { $in: myArchivedOpportunityIds } }
    }, {
      subject: SchemaName,
      action: Action.READ,
      conditions: { opportunity: { $in: myArchivedOpportunityIds } }
    }, {
      subject: SchemaName,
      action: Action.CREATE,
      inverted: true
    }, {
      subject: SchemaName,
      action: Action.UPDATE,
      conditions: { opportunity: { $in: myArchivedOpportunityIds } }
    }, {
      subject: SchemaName,
      action: Action.DELETE,
      inverted: true
    })
  }

  return {
    [Role.ANON]: anonRules,
    [Role.VOLUNTEER_PROVIDER]: allRules,
    [Role.OPPORTUNITY_PROVIDER]: opportunityProviderRules,
    [Role.ACTIVITY_PROVIDER]: allRules,
    [Role.ORG_ADMIN]: allRules,
    [Role.ADMIN]: allRules
  }
}

module.exports = ruleBuilder
