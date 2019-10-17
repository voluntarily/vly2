import { Role } from '../../../services/authorize/role'
import { Action } from '../../../services/abilities/ability.constants'

const subject = 'BAR'
const ruleBuilder = session => {
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

  return {
    [Role.ANON]: anonAbilities,
    [Role.ALL]: allAbilities
  }
}

module.exports = ruleBuilder
