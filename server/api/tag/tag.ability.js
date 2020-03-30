const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { SchemaName } = require('./tag.constants')

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
const ruleBuilder = (session) => {
  // block all api call for non log in user
  const anonAbilities = [
    {
      subject: SchemaName,
      action: Action.CRUD,
      inverted: true,
      reason: 'You must be signed in to access this resource'
    }
  ]

  // allow log in person to list the tags
  // no create, update, delete via the API
  const defaultAbilities = [
    {
      subject: SchemaName,
      action: [Action.LIST, Action.READ]
    }
  ]

  const adminAbilities = [{
    subject: SchemaName,
    action: Action.MANAGE
  }]

  return {
    [Role.ANON]: anonAbilities,
    [Role.ACTIVITY_PROVIDER]: defaultAbilities,
    [Role.VOLUNTEER]: defaultAbilities,
    [Role.OPPORTUNITY_PROVIDER]: defaultAbilities,
    [Role.SUPPORT]: defaultAbilities,
    [Role.ADMIN]: adminAbilities
  }
}

module.exports = ruleBuilder
