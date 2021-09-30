import { Role } from '../../services/authorize/role'
import { Action } from '../../services/abilities/ability.constants'
import { SchemaName, MemberStatus } from './member.constants'

const ruleBuilder = async (session) => {
  const anonRules = [{
    subject: SchemaName,
    action: Action.MANAGE,
    inverted: true
  }]

  const basicRules = []

  if (session.me && session.me._id) {
    basicRules.push({
      subject: SchemaName,
      action: [Action.LIST, Action.READ],
      conditions: { person: session.me._id }
    }, {
      subject: SchemaName,
      action: Action.CREATE,
      conditions: {
        person: session.me._id,
        status: { $in: [MemberStatus.JOINER, MemberStatus.FOLLOWER, MemberStatus.VALIDATOR] }
      }
    }, {
      subject: SchemaName,
      action: Action.UPDATE,
      conditions: {
        person: session.me._id,
        status: {
          $in: [
            MemberStatus.NONE,
            MemberStatus.JOINER,
            MemberStatus.FOLLOWER,
            MemberStatus.VALIDATOR,
            MemberStatus.EXMEMBER
          ]
        }
      }
    }, {
      subject: SchemaName,
      action: Action.DELETE,
      inverted: true
    })
  }

  const orgAdminRules = []

  if (session.me && session.me._id && session.me.role.includes(Role.ORG_ADMIN)) {
    orgAdminRules.push({
      subject: SchemaName,
      action: [Action.LIST, Action.READ, Action.CREATE, Action.UPDATE],
      conditions: { organisation: { $in: session.me.orgAdminFor } }
    })
  }

  const adminRules = [{
    subject: SchemaName,
    action: Action.MANAGE
  }]

  return {
    [Role.ANON]: anonRules,
    [Role.BASIC]: basicRules,
    [Role.VOLUNTEER]: basicRules,
    [Role.OPPORTUNITY_PROVIDER]: basicRules,
    [Role.ORG_ADMIN]: orgAdminRules,
    [Role.ADMIN]: adminRules
  }
}

export default ruleBuilder
