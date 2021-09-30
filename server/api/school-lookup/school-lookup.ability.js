const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { SchemaName } = require('./school-lookup.constants')

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

module.exports = ruleBuilder
