const { OpportunitySubject, OpportunityStatus, OpportunityFields } = require('./opportunity.constants')
const { Role } = require('../../services/auth/role')
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

const anonAbilities = [{
  OpportunitySubject,
  action: Action.READ,
  conditions: { status: OpportunityStatus.ACTIVE }
}, {
  OpportunitySubject,
  action: Action.LIST,
  conditions: { status: OpportunityStatus.ACTIVE },
  fields: [OpportunityFields.ID, OpportunityFields.TITLE, OpportunityFields.SUBTITLE, OpportunityFields.IMG_URL, OpportunityFields.DURATION]
}, {
  OpportunitySubject,
  action: Action.UPDATE,
  inverted: true
}, {
  OpportunitySubject,
  action: Action.DELETE,
  inverted: true
}, {
  OpportunitySubject,
  action: Action.CREATE,
  inverted: true
}]

const allAbilities = [{ OpportunitySubject, action: Action.READ }, { OpportunitySubject, action: Action.LIST }]
const vpAbilities = allAbilities
const opAbilities = allAbilities.concat([{ OpportunitySubject, action: Action.CREATE }, { OpportunitySubject, action: Action.UPDATE }])
const testerAbilities = [{ OpportunitySubject, action: Action.MANAGE }]
const adminAbilities = [{ OpportunitySubject, action: Action.MANAGE }]
const orgAdminAbilities = [{ OpportunitySubject, action: Action.MANAGE }]

module.exports = {
  [Role.ANON]: anonAbilities,
  [Role.VOLUNTEER_PROVIDER]: vpAbilities,
  [Role.OPPORTUNITY_PROVIDER]: opAbilities,
  [Role.TESTER]: testerAbilities,
  [Role.ADMIN]: adminAbilities,
  [Role.ORG_ADMIN]: orgAdminAbilities
}
