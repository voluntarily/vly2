const { Subject, OpportunityStatus, OpportunityFields } = require('./opportunity.constants')
const { Role } = require('../../services/auth/role')
const { Action } = require('../../services/abilities/ability.constants')

/*
// TypeScript definition
interface Rule {
  actions: string | string[],
  Subject: string | string[],
  conditions?: Object,
  fields?: string[],
  inverted?: boolean, // default is `false`
  reason?: string // mainly to specify why user can't do something. See forbidden reasons for details
}
*/

const anonAbilities = [{
  Subject,
  action: Action.READ,
  conditions: { status: OpportunityStatus.ACTIVE }
}, {
  Subject,
  action: Action.LIST,
  conditions: { status: OpportunityStatus.ACTIVE },
  fields: [OpportunityFields.ID, OpportunityFields.TITLE, OpportunityFields.SUBTITLE, OpportunityFields.IMG_URL, OpportunityFields.DURATION]
}, {
  Subject,
  action: Action.UPDATE,
  inverted: true
}, {
  Subject,
  action: Action.DELETE,
  inverted: true
}, {
  Subject,
  action: Action.CREATE,
  inverted: true
}]

const allAbilities = [{ Subject, action: Action.READ }, { Subject, action: Action.LIST }]
const vpAbilities = allAbilities.concat([{ Subject, action: Action.CREATE }])
const opAbilities = allAbilities.concat([{ Subject, action: Action.CREATE }])
const testerAbilities = [{ Subject, action: Action.MANAGE }]
const adminAbilities = [{ Subject, action: Action.MANAGE }]
const orgAdminAbilities = [{ Subject, action: Action.MANAGE }]

module.exports = {
  [Role.ANON]: anonAbilities,
  [Role.VOLUNTEER_PROVIDER]: vpAbilities,
  [Role.OPPORTUNITY_PROVIDER]: opAbilities,
  [Role.TESTER]: testerAbilities,
  [Role.ADMIN]: adminAbilities,
  [Role.ORG_ADMIN]: orgAdminAbilities
}
