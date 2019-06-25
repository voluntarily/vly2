import { Role } from '../../../services/auth/role'
import { Action } from '../../../services/abilities/ability.constants'

const subject = 'BAR'

const anonAbilities = [{
  subject,
  action: Action.READ
},
{
  subject,
  action: Action.LIST
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
  [Role.ANON]: anonAbilities,
  [Role.ALL]: allAbilities
}
