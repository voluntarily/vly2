const { OpportunityStatus, OpportunityFields } = require('./opportunity.constants')
const { Roles } = require('../../services/auth/role')
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
  conditions: { status: OpportunityStatus.DRAFT }
},
{
  subject,
  action: Action.LIST,
  conditions: { status: OpportunityStatus.DRAFT },
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

const allAbilities = [{ subject, action: Action.READ }]

module.exports = {
  [Roles.ANON]: anonAbilities,
  [Roles.ALL]: allAbilities
}
