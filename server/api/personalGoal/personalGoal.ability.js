const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { SchemaName, PersonalGoalFields } = require('./personalGoal.constants')

// WIKI rules : https://voluntarily.atlassian.net/wiki/spaces/VP/pages/18677761/API+Access+Security+Rules
const ruleBuilder = (session, query) => {
  // https://github.com/stalniy/casl/issues/229
  // block all api call for non log in user
  const anonAbilities = [{
    subject: SchemaName,
    action: Action.CRUD,
    inverted: true
  }]
  const personId = session && session.me && session.me._id ? session.me._id.toString() : undefined
  const authedAbilities = []
  const { meid } = query

  if (meid && meid === personId) { // if there is a meid query param we are listing someones pgs
    authedAbilities.push({
      subject: SchemaName,
      action: Action.LIST,
      reason: 'You can only list your own goals'
    })
    authedAbilities.push({
      subject: SchemaName,
      action: Action.READ,
      reason: 'You can only read your own goals'
    })
  }
  // allow update only status fields. put verifies person
  authedAbilities.push({
    subject: SchemaName,
    action: Action.UPDATE,
    reason: 'You can only change status',
    conditions: {
      person: personId
    },
    fields: [ // can only change status
      PersonalGoalFields.STATUS
    ]
  })

  const adminAbilities = [{ subject: SchemaName, action: Action.MANAGE }]

  return {
    [Role.ANON]: anonAbilities,
    [Role.VOLUNTEER_PROVIDER]: authedAbilities,
    [Role.OPPORTUNITY_PROVIDER]: authedAbilities,
    [Role.ACTIVITY_PROVIDER]: authedAbilities,
    [Role.ADMIN]: adminAbilities,
    [Role.ALL]: authedAbilities
  }
}

module.exports = ruleBuilder
