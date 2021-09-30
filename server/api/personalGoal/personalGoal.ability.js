import { Role } from '../../services/authorize/role'
import { Action } from '../../services/abilities/ability.constants'
import { SchemaName, PersonalGoalFields } from './personalGoal.constants'

// WIKI rules : https://voluntarily.atlassian.net/wiki/spaces/VP/pages/18677761/API+Access+Security+Rules
const ruleBuilder = session => {
  // https://github.com/stalniy/casl/issues/229
  // block all api call for non log in user
  const anonAbilities = [{
    subject: SchemaName,
    action: Action.CRUD,
    inverted: true
  }]
  const personId = session && session.me && session.me._id ? session.me._id.toString() : undefined
  const authedAbilities = [{
    subject: SchemaName,
    action: Action.LIST,
    conditions: { person: personId }
  }, {
    subject: SchemaName,
    action: Action.READ,
    conditions: { person: personId }
  }, {
    subject: SchemaName,
    action: Action.UPDATE,
    reason: 'You can only change status',
    conditions: { person: personId },
    fields: [ // can only change status
      PersonalGoalFields.STATUS
    ]
  }]

  const adminAbilities = [{ subject: SchemaName, action: Action.MANAGE }]

  return {
    [Role.ANON]: anonAbilities,
    [Role.BASIC]: authedAbilities,
    [Role.VOLUNTEER]: authedAbilities,
    [Role.ADMIN]: adminAbilities
  }
}

export default ruleBuilder
