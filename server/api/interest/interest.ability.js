const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { InterestStatus, SchemaName } = require('./interest.constants')
const Opportunity = require('../opportunity/opportunity')

const ruleBuilder = async (session) => {
  const anonRules = [{
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

  // const allRules = anonRules.slice(0)

  const volunteerRules = []

  if (session.me && session.me._id) {
    volunteerRules.push({
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

  const adminRules = [{
    subject: SchemaName,
    action: Action.MANAGE
  }]

  return {
    [Role.ANON]: anonRules,
    [Role.VOLUNTEER_PROVIDER]: volunteerRules,
    [Role.ACTIVITY_PROVIDER]: volunteerRules,
    [Role.OPPORTUNITY_PROVIDER]: opportunityProviderRules,
    [Role.ORG_ADMIN]: orgAdminRules,
    [Role.ADMIN]: adminRules
  }
}

module.exports = ruleBuilder
