import { Role } from '../../services/authorize/role'
import { Action } from '../../services/abilities/ability.constants'
import { SchemaName, StoryStatus } from './story.constants'

const ruleBuilder = async (session) => {
  const anonRules = [{
    subject: SchemaName,
    action: [Action.LIST, Action.READ],
    conditions: { status: StoryStatus.PUBLISHED }
  }, {
    subject: SchemaName,
    action: [Action.UPDATE, Action.CREATE, Action.DELETE],
    inverted: true
  }]

  const basicRules = [{
    subject: SchemaName,
    action: [Action.LIST, Action.READ],
    conditions: { status: StoryStatus.PUBLISHED }
  }, {
    subject: SchemaName,
    action: [Action.LIST, Action.READ],
    conditions: { author: session.me._id }
  }, {
    subject: SchemaName,
    action: [Action.CREATE, Action.UPDATE],
    conditions: {
      author: session.me._id,
      status: {
        $in: [StoryStatus.DRAFT, StoryStatus.PUBLISHED]
      }
    }
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }]

  const adminRules = [{
    subject: SchemaName,
    action: Action.MANAGE
  }]

  return {
    [Role.ANON]: anonRules,
    [Role.BASIC]: basicRules,
    [Role.VOLUNTEER]: basicRules,
    [Role.ADMIN]: adminRules
  }
}

export default ruleBuilder
