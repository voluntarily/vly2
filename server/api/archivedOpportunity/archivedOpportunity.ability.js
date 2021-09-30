import { Role } from '../../services/authorize/role'
import { Action } from '../../services/abilities/ability.constants'
import { SchemaName } from './archivedOpportunity.constants'
import { OpportunityStatus, OpportunityFields, OpportunityListFields } from '../opportunity/opportunity.constants'

const ruleBuilder = session => {
  const anonAbilities = [{
    subject: SchemaName,
    action: Action.LIST,
    conditions: { status: { $in: [OpportunityStatus.COMPLETED] } },
    fields: Object.values(OpportunityListFields)
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

  const opAbilities = [
    {
      subject: SchemaName,
      action: Action.LIST,
      conditions: { requestor: session.me && session.me._id },
      fields: Object.values(OpportunityListFields)
    }, {
      subject: SchemaName,
      action: Action.READ,
      conditions: { status: { $in: [OpportunityStatus.COMPLETED] } },
      fields: Object.values(OpportunityFields)
    }, {
      subject: SchemaName,
      action: Action.READ,
      conditions: { requestor: session.me && session.me._id },
      fields: Object.values(OpportunityFields)
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

  const orgAdminAbilities = [
    {
      subject: SchemaName,
      action: Action.LIST,
      fields: Object.values(OpportunityListFields)
    }, {
      subject: SchemaName,
      action: Action.READ,
      fields: Object.values(OpportunityFields)
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
      action: Action.CREATE
    }]

  const adminAbilities = [
    {
      subject: SchemaName,
      action: Action.LIST,
      fields: Object.values(OpportunityListFields)
    }, {
      subject: SchemaName,
      action: Action.READ,
      fields: Object.values(OpportunityFields)
    }, {
      subject: SchemaName,
      action: Action.UPDATE
    }, {
      subject: SchemaName,
      action: Action.DELETE
    }, {
      subject: SchemaName,
      action: Action.CREATE
    }]

  return {
    [Role.ANON]: anonAbilities,
    [Role.BASIC]: anonAbilities,
    [Role.VOLUNTEER]: anonAbilities,
    [Role.OPPORTUNITY_PROVIDER]: opAbilities,
    [Role.SUPPORT]: adminAbilities,
    [Role.ADMIN]: adminAbilities,
    [Role.ORG_ADMIN]: orgAdminAbilities
  }
}

export default ruleBuilder
