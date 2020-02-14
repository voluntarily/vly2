const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { InterestStatus, SchemaName } = require('./interest.constants')
const Opportunity = require('../opportunity/opportunity')

const ruleBuilder = async (session) => {
  const anonAbilities = [{
    subject: SchemaName,
    action: Action.LIST,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.CREATE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.READ,
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

  const volunteerAbilities = []

  if (session.me && session.me._id) {
    volunteerAbilities.push({
      subject: SchemaName,
      action: Action.LIST,
      conditions: { person: session.me._id }
    }, {
      subject: SchemaName,
      action: Action.READ,
      conditions: { person: session.me._id }
    }, {
      subject: SchemaName,
      action: Action.CREATE,
      conditions: { person: session.me._id, status: InterestStatus.INTERESTED }
    }, {
      subject: SchemaName,
      action: Action.UPDATE,
      inverted: true
    }, {
      subject: SchemaName,
      action: Action.DELETE,
      conditions: { person: session.me._id }
    })
  }

  const opportunityProviderRules = []

  if (session.me && session.me._id && session.me.role.includes(Role.OPPORTUNITY_PROVIDER)) {
    const myOpportunities = await Opportunity.find({ requestor: session.me._id })
    const myOpportunityIds = myOpportunities.map(opportunity => opportunity._id.toString())

    opportunityProviderRules.push({
      subject: SchemaName,
      action: Action.LIST,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: SchemaName,
      action: Action.READ,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: SchemaName,
      action: Action.CREATE,
      inverted: true
    }, {
      subject: SchemaName,
      action: Action.UPDATE,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: SchemaName,
      action: Action.DELETE,
      inverted: true
    })
  }

  const orgAdminRules = []

  if (session.me && session.me._id && session.me.role.includes(Role.ORG_ADMIN)) {
    const myOpportunities = await Opportunity.find({ offerOrg: { $in: session.me.orgAdminFor } })
    const myOpportunityIds = myOpportunities.map(opportunity => opportunity._id.toString())

    orgAdminRules.push({
      subject: SchemaName,
      action: Action.LIST,
      conditions: { opportunity: { $in: myOpportunityIds } }
    })
  }

  return {
    [Role.ANON]: anonAbilities,
    [Role.VOLUNTEER_PROVIDER]: volunteerAbilities,
    [Role.OPPORTUNITY_PROVIDER]: opportunityProviderRules,
    [Role.ACTIVITY_PROVIDER]: allAbilities,
    [Role.ORG_ADMIN]: orgAdminRules,
    [Role.ADMIN]: allAbilities
  }
}

module.exports = ruleBuilder
