const { OpportunityStatus, OpportunityFields } = require('./opportunity.constants')
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

const subject = 'Opportunity'

const anonAbilities = [{
  subject,
  action: Action.READ,
  conditions: { status: OpportunityStatus.ACTIVE }
}, {
  subject,
  action: Action.LIST,
  conditions: { status: OpportunityStatus.ACTIVE },
  fields: [OpportunityFields.ID, OpportunityFields.TITLE, OpportunityFields.SUBTITLE, OpportunityFields.IMG_URL, OpportunityFields.DURATION]
}, {
  subject,
  action: Action.UPDATE,
  inverted: true
}, {
  subject,
  action: Action.DELETE,
  inverted: true
}, {
  subject,
  action: Action.CREATE,
  inverted: true
}]

const allAbilities = [{ subject, action: Action.READ }, { subject, action: Action.LIST }]
const vpAbilities = allAbilities
const opAbilities = allAbilities.concat([{ subject, action: Action.CREATE }, { subject, action: Action.UPDATE }])
const testerAbilities = [{ subject, action: Action.MANAGE }]
const adminAbilities = [{ subject, action: Action.MANAGE }]
const orgAdminAbilities = [{ subject, action: Action.MANAGE }]

module.exports = {
  [Role.ANON]: anonAbilities,
  [Role.VOLUNTEER_PROVIDER]: vpAbilities,
  [Role.OPPORTUNITY_PROVIDER]: opAbilities,
  [Role.TESTER]: testerAbilities,
  [Role.ADMIN]: adminAbilities,
  [Role.ORG_ADMIN]: orgAdminAbilities
}
