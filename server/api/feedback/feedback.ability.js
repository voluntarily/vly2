const { Role } = require('../../services/authorize/role')
const { SchemaName } = require('./feedback.constants')
const { Action } = require('../../services/abilities/ability.constants')

const ruleBuilder = async (session) => {
  if (!session.me || !session.me._id) return {}
  const volunteerRules = [
    {
      subject: SchemaName,
      action: Action.CREATE,
      conditions: { respondent: session.me._id }
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
    [Role.ADMIN]: adminRules
  }
}
module.exports = ruleBuilder
