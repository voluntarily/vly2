const { Role } = require('../../services/authorize/role')
const { SchemaName } = require('./feedback.constants')
const { Action } = require('../../services/abilities/ability.constants')

const ruleBuilder = async (session) => {
  if (!session.me || !session.me._id) return {}
  const volunteerRules = [
    {
      subject: SchemaName,
      action: [Action.CREATE, Action.LIST, Action.READ],
      conditions: { respondent: session.me._id }
    },
    {
      subject: SchemaName,
      action: [Action.UPDATE],
      conditions: { respondent: session.me._id },
      fields: ['rating']
    }
  ]

  const orgAdminRules = [
    {
      subject: SchemaName,
      action: [Action.LIST, Action.READ],
      conditions: { respondentOrgs: { $in: session.me.orgAdminFor } }
    }
  ]

  const adminRules = [
    {
      subject: SchemaName,
      action: Action.MANAGE
    }
  ]

  return {
    [Role.VOLUNTEER]: volunteerRules,
    [Role.ORG_ADMIN]: orgAdminRules,
    [Role.ADMIN]: adminRules
  }
}
module.exports = ruleBuilder
