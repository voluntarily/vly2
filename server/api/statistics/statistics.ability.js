const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { Subject } = require('./statistics.constants')

const ruleBuilder = session => {
  const orgAdminAbilities = [{
    subject: Subject,
    action: Action.READ,
    conditions: { organisation: { $in: session.me.orgAdminFor } }
  }]

  return {
    [Role.ORG_ADMIN]: orgAdminAbilities
  }
}

module.exports = ruleBuilder
