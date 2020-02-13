const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { InterestStatus, SchemaName } = require('./interest.constants')

const ruleBuilder = session => {
  const anonAbilities = [{
    subject: SchemaName,
    action: Action.LIST,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.CREATE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.READ,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.UPDATE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }]

  const allAbilities = anonAbilities.slice(0)

  const volunteerAbilities = []

  if (session.me && session.me._id) {
    volunteerAbilities.push({
      subject: SchemaName,
      action: Action.LIST,
      conditions: { person: session.me._id }
    }, {
      subject: SchemaName,
      action: Action.READ,
      conditions: { person: session.me._id }
    }, {
      subject: SchemaName,
      action: Action.CREATE,
      conditions: { person: session.me._id, status: InterestStatus.INTERESTED }
    }, {
      subject: SchemaName,
      action: Action.UPDATE,
      inverted: true
    })
  }

  return {
    [Role.ANON]: anonAbilities,
    [Role.VOLUNTEER_PROVIDER]: volunteerAbilities,
    [Role.OPPORTUNITY_PROVIDER]: allAbilities,
    [Role.ACTIVITY_PROVIDER]: allAbilities,
    [Role.ORG_ADMIN]: allAbilities,
    [Role.ADMIN]: allAbilities
  }
}

module.exports = ruleBuilder
