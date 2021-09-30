import { Role } from '../../services/authorize/role'
import { Action } from '../../services/abilities/ability.constants'
import { SchemaName } from './school-lookup.constants'

const ruleBuilder = async (session) => {
  const anonRules = [{
    subject: SchemaName,
    action: Action.MANAGE,
    inverted: true
  }]

  const basicRules = anonRules.slice(0)

  const adminRules = [{
    subject: SchemaName,
    action: Action.LIST
  }]

  return {
    [Role.ANON]: anonRules,
    [Role.BASIC]: basicRules,
    [Role.ADMIN]: adminRules
  }
}

export default ruleBuilder
