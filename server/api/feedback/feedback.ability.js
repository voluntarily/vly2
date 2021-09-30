import { Role } from '../../services/authorize/role'
import { SchemaName } from './feedback.constants'
import { Action } from '../../services/abilities/ability.constants'

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
export default ruleBuilder
