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

  const allRules = []

  return {
    [Role.ANON]: anonRules,
    [Role.VOLUNTEER_PROVIDER]: allRules,
    [Role.OPPORTUNITY_PROVIDER]: allRules,
    [Role.ACTIVITY_PROVIDER]: allRules,
    [Role.ORG_ADMIN]: allRules,
    [Role.ADMIN]: allRules
  }
}

module.exports = ruleBuilder
