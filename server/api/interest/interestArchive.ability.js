import { Role } from '../../services/authorize/role'
import { Action } from '../../services/abilities/ability.constants'
import { find } from '../archivedOpportunity/archivedOpportunity'
import { InterestArchiveSchemaName } from './interest.constants'

const ruleBuilder = async (session) => {
  const anonRules = [{
    subject: InterestArchiveSchemaName,
    action: Action.LIST,
    inverted: true
  }, {
    subject: InterestArchiveSchemaName,
    action: Action.CREATE,
    inverted: true
  }, {
    subject: InterestArchiveSchemaName,
    action: Action.READ,
    inverted: true
  }, {
    subject: InterestArchiveSchemaName,
    action: Action.UPDATE,
    inverted: true
  }, {
    subject: InterestArchiveSchemaName,
    action: Action.DELETE,
    inverted: true
  }]

  const basicRules = []

  if (session.me && session.me._id) {
    basicRules.push({
      subject: InterestArchiveSchemaName,
      action: Action.LIST,
      conditions: { person: session.me._id }
    }, {
      subject: InterestArchiveSchemaName,
      action: Action.READ,
      conditions: { person: session.me._id }
    }, {
      subject: InterestArchiveSchemaName,
      action: Action.CREATE,
      inverted: true
    }, {
      subject: InterestArchiveSchemaName,
      action: Action.UPDATE,
      inverted: true
    }, {
      subject: InterestArchiveSchemaName,
      action: Action.DELETE,
      inverted: true
    })
  }

  const opportunityProviderRules = []
  if (session.me && session.me._id && session.me.role.includes(Role.OPPORTUNITY_PROVIDER)) {
    const myOpportunities = await find({ requestor: session.me._id })
    const myOpportunityIds = myOpportunities.map(op => op._id.toString())
    opportunityProviderRules.push({
      subject: InterestArchiveSchemaName,
      action: Action.LIST,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: InterestArchiveSchemaName,
      action: Action.READ,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: InterestArchiveSchemaName,
      action: Action.CREATE,
      inverted: true
    }, {
      subject: InterestArchiveSchemaName,
      action: Action.UPDATE,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: InterestArchiveSchemaName,
      action: Action.DELETE,
      inverted: true
    })
  }

  const orgAdminRules = []

  if (session.me && session.me._id && session.me.role.includes(Role.ORG_ADMIN)) {
    const myOpportunities = await find({ offerOrg: { $in: session.me.orgAdminFor } })
    const myOpportunityIds = myOpportunities.map(op => op._id.toString())

    orgAdminRules.push({
      subject: InterestArchiveSchemaName,
      action: Action.LIST,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: InterestArchiveSchemaName,
      action: Action.READ,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: InterestArchiveSchemaName,
      action: Action.CREATE,
      inverted: true
    }, {
      subject: InterestArchiveSchemaName,
      action: Action.UPDATE,
      conditions: { opportunity: { $in: myOpportunityIds } }
    }, {
      subject: InterestArchiveSchemaName,
      action: Action.DELETE,
      inverted: true
    })
  }

  const adminRules = [{
    subject: InterestArchiveSchemaName,
    action: Action.READ
  }, {
    subject: InterestArchiveSchemaName,
    action: Action.LIST
  }, {
    subject: InterestArchiveSchemaName,
    action: Action.UPDATE
  }, {
    subject: InterestArchiveSchemaName,
    action: Action.DELETE,
    inverted: true
  }, {
    subject: InterestArchiveSchemaName,
    action: Action.CREATE,
    inverted: true
  }]
  return {
    [Role.ANON]: anonRules,
    [Role.BASIC]: basicRules,
    [Role.VOLUNTEER]: basicRules,

    [Role.OPPORTUNITY_PROVIDER]: opportunityProviderRules,
    [Role.ORG_ADMIN]: orgAdminRules,
    [Role.ADMIN]: adminRules
  }
}

export default ruleBuilder
