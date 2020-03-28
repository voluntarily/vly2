const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { SchemaName, StoryStatus } = require('./story.constants')

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

  const allRules = [{
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
    [Role.VOLUNTEER]: allRules,
    [Role.OPPORTUNITY_PROVIDER]: allRules,
    [Role.ACTIVITY_PROVIDER]: allRules,
    [Role.ORG_ADMIN]: allRules,
    [Role.ADMIN]: adminRules
  }
}

module.exports = ruleBuilder
