const { Role } = require('../../services/auth/role')
const { Action } = require('../../services/abilities/ability.constants')
// const { PersonFields } = require('./person.constants')
const SchemaName = 'Person'

// block all api call for non log in user
const anonAbilities = [{
  SchemaName,
  action: Action.READ,
  inverted: true
}, {
  SchemaName,
  action: Action.LIST,
  inverted: true // Not log in user can not do this
}, {
  SchemaName,
  action: Action.UPDATE,
  inverted: true
}, {
  SchemaName,
  action: Action.DELETE,
  inverted: true
}]

// const allAbilities = [{
//   subject: SchemaName,
//   action: Action.READ
//   // TODO: add field allowed all logged in user to see other basic people info.
// }]

module.exports = {
  [Role.ANON]: anonAbilities,
  [Role.VOLUNTEER_PROVIDER]: anonAbilities,
  [Role.OPPORTUNITY_PROVIDER]: anonAbilities,
  [Role.TESTER]: anonAbilities,
  [Role.ADMIN]: anonAbilities,
  [Role.ORG_ADMIN]: anonAbilities
}
