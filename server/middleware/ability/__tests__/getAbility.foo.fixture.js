import { Role } from '../../../services/auth/role'
import { Action } from '../../../services/abilities/ability.constants'

const subject = 'FOO'

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
const vpAbilities = [{ subject, action: Action.DELETE }]
const testerAbilities = [{ subject, action: Action.UPDATE }]

module.exports = {
  [Role.ANON]: anonAbilities,
  [Role.ALL]: allAbilities,
  [Role.VOLUNTEER_PROVIDER]: vpAbilities,
  [Role.TESTER]: testerAbilities
}
