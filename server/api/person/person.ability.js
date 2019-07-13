const { Role } = require('../../services/auth/role')
const { Action } = require('../../services/abilities/ability.constants')

const SchemaName = 'Person'

const anonAbilities = [{
    SchemaName,
    action: Action.READ,
    inverted: true
},{
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

module.exports = {
    [Role.ANON]: anonAbilities,
    [Role.VOLUNTEER_PROVIDER]: anonAbilities,
    [Role.OPPORTUNITY_PROVIDER]: anonAbilities,
    [Role.TESTER]: anonAbilities,
    [Role.ADMIN]: anonAbilities,
    [Role.ORG_ADMIN]: anonAbilities 
}