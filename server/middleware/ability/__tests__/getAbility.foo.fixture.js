import { Role } from '../../../services/authorize/role'
import { Action } from '../../../services/abilities/ability.constants'

const subject = 'FOO'
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
  const vpAbilities = [{ subject, action: Action.DELETE }]
  const testerAbilities = [{ subject, action: Action.UPDATE }]

  return {
    [Role.ANON]: anonAbilities,
    [Role.ALL]: allAbilities,
    [Role.VOLUNTEER]: vpAbilities,
    [Role.TESTER]: testerAbilities
  }
}

module.exports = ruleBuilder
