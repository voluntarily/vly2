const { Role } = require('../../services/auth/role')
const { Action } = require('../../services/abilities/ability.constants')
const { PersonFields } = require('./person.constants')
const SchemaName = 'Person'

// block all api call for non log in user
const anonAbilities = [{
  SchemaName,
  action: Action.CRUD,
  inverted: true
}]

const allAbilities = [{
  subject: SchemaName,
  action: Action.READ,
  fields: [
    PersonFields.ID,
    PersonFields.NICKNAME,
    PersonFields.LANGUAGE,
    PersonFields.STATUS
  ]
}, {
  subject: SchemaName,
  action: Action.LIST,
  fields: [
    PersonFields.ABOUT,
    PersonFields.AVATAR,
    PersonFields.ID,
    PersonFields.NICKNAME,
    PersonFields.STATUS
  ]
}, {
  subject: SchemaName,
  action: Action.DELETE,
  inverted: true
}]

// const testerAbility = [{
//   subject: SchemaName,
//   action: Action.READ,
//   fields: [

//   ]
// }]

const adminAbilities = [{ subject: SchemaName, action: Action.MANAGE }]
module.exports = {
  [Role.ANON]: anonAbilities,
  [Role.VOLUNTEER_PROVIDER]: allAbilities,
  [Role.OPPORTUNITY_PROVIDER]: anonAbilities,
  [Role.TESTER]: adminAbilities, // Confusing but the wiki is not clear about tester ability
  [Role.ADMIN]: adminAbilities,
  [Role.ORG_ADMIN]: adminAbilities
}
