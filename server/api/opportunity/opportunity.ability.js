import { SchemaName, OpportunityStatus, OpportunityListFields, OpportunityPublicFields, OpportunityPublishedStatus } from './opportunity.constants'
import { Role } from '../../services/authorize/role'
import { Action } from '../../services/abilities/ability.constants'

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
    fields: OpportunityPublicFields
  }, {
    subject: SchemaName,
    action: Action.LIST,
    conditions: { status: OpportunityStatus.ACTIVE },
    fields: OpportunityListFields
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

  const supportAbilities = [{ subject: SchemaName, action: Action.MANAGE }]
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
    [Role.BASIC]: anonAbilities,
    [Role.VOLUNTEER]: opAbilities,
    [Role.OPPORTUNITY_PROVIDER]: opAbilities,
    [Role.SUPPORT]: supportAbilities,
    [Role.ADMIN]: adminAbilities,
    [Role.ORG_ADMIN]: orgAdminAbilities
  }
}

export default ruleBuilder
