const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const Opportunity = require('../opportunity/opportunity')
const { InterestSchemaName, InterestStatus } = require('./interest.constants')

const ruleBuilder = async (session) => {
  const anonRules = [{
    subject: InterestSchemaName,
    action: Action.LIST,
    inverted: true
  }, {
    subject: InterestSchemaName,
    action: Action.CREATE,
    inverted: true
  }, {
    subject: InterestSchemaName,
    action: Action.READ,
    inverted: true
  }, {
    subject: InterestSchemaName,
    action: Action.UPDATE,
    inverted: true
  }, {
    subject: InterestSchemaName,
    action: Action.DELETE,
    inverted: true
  }]

  const volunteerRules = []

  if (session.me && session.me._id) {
    volunteerRules.push({
      subject: InterestSchemaName,
      action: Action.LIST,
      conditions: { person: session.me._id }
    }, {
      subject: InterestSchemaName,
      action: Action.READ,
      conditions: { person: session.me._id }
    }, {
      subject: InterestSchemaName,
      action: Action.CREATE,
      conditions: { person: session.me._id, status: InterestStatus.INTERESTED }
    }, {
      subject: InterestSchemaName,
      action: Action.UPDATE,
      conditions: { person: session.me._id, status: { $in: [InterestStatus.INTERESTED, InterestStatus.COMMITTED] } }
    }, {
      subject: InterestSchemaName,
      action: Action.DELETE,
      conditions: { person: session.me._id }
    })
  }

  const opportunityProviderRules = []

  if (session.me && session.me._id && session.me.role.includes(Role.OPPORTUNITY_PROVIDER)) {
    const myOpportunities = await Opportunity.find({ requestor: session.me._id })
    const myOpportunityIds = myOpportunities.map(opportunity => opportunity._id.toString())

    opportunityProviderRules.push({
      subject: InterestSchemaName,
      action: Action.LIST,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: InterestSchemaName,
      action: Action.READ,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: InterestSchemaName,
      action: Action.CREATE,
      conditions: { person: session.me._id, status: InterestStatus.INTERESTED }
    }, {
      subject: InterestSchemaName,
      action: Action.UPDATE,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: InterestSchemaName,
      action: Action.DELETE,
      conditions: { person: session.me._id }
    })
  }

  const orgAdminRules = []

  if (session.me && session.me._id && session.me.role.includes(Role.ORG_ADMIN)) {
    const myOpportunities = await Opportunity.find({ offerOrg: { $in: session.me.orgAdminFor } })
    const myOpportunityIds = myOpportunities.map(opportunity => opportunity._id.toString())

    orgAdminRules.push({
      subject: InterestSchemaName,
      action: Action.LIST,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: InterestSchemaName,
      action: Action.READ,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: InterestSchemaName,
      action: Action.CREATE,
      conditions: { person: session.me._id, status: InterestStatus.INTERESTED }
    }, {
      subject: InterestSchemaName,
      action: Action.UPDATE,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: InterestSchemaName,
      action: Action.DELETE,
      conditions: { person: session.me._id }
    })
  }

  const adminRules = [{
    subject: InterestSchemaName,
    action: Action.MANAGE
  }]

  return {
    [Role.ANON]: anonRules,
    [Role.VOLUNTEER]: volunteerRules,
    // [Role.ACTIVITY_PROVIDER]: volunteerRules, // don't include roles that have no rules
    [Role.OPPORTUNITY_PROVIDER]: opportunityProviderRules,
    [Role.ORG_ADMIN]: orgAdminRules,
    [Role.ADMIN]: adminRules
  }
}

module.exports = ruleBuilder
