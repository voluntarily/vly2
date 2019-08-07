const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { PersonFields } = require('./person.constants')
const SchemaName = 'Person'

// WIKI rules : https://voluntarily.atlassian.net/wiki/spaces/VP/pages/18677761/API+Access+Security+Rules
const ruleBuilder = session => {
  // block all api call for non log in user
  const anonAbilities = [{
    subject: SchemaName,
    action: Action.CRUD,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.CREATE
  }]

  const userID = session.me ? session.me._id : undefined
  const allAbilities = [{
    subject: SchemaName,
    action: Action.READ,
    fields: [
      PersonFields.ID,
      PersonFields.NICKNAME,
      PersonFields.LANGUAGE,
      PersonFields.NAME,
      PersonFields.STATUS,
      PersonFields.AVATAR,
      PersonFields.ABOUT,
      PersonFields.ROLE
    ]
  }, {
    subject: SchemaName,
    action: Action.LIST,
    fields: [
      PersonFields.ID,
      PersonFields.NICKNAME,
      PersonFields.LANGUAGE,
      PersonFields.STATUS,
      PersonFields.AVATAR,
      PersonFields.NAME,
      PersonFields.ROLE,
      PersonFields.ABOUT
    ]
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.CREATE
  }, {
    subject: SchemaName,
    action: Action.UPDATE,
    conditions: {
      _id: userID
    }
  }]

  const adminAbilities = [{ subject: SchemaName, action: Action.MANAGE }]

  return {
    [Role.ANON]: anonAbilities,
    [Role.VOLUNTEER_PROVIDER]: allAbilities,
    [Role.OPPORTUNITY_PROVIDER]: allAbilities,
    [Role.TESTER]: adminAbilities, // Confusing but the wiki is not clear about tester ability
    [Role.ADMIN]: adminAbilities,
    [Role.ACTIVITY_PROVIDER]: allAbilities,
    [Role.ALL]: allAbilities,
    [Role.ORG_ADMIN]: adminAbilities
  }
}

module.exports = ruleBuilder
