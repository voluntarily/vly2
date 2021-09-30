const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const { ActivityStatus, SchemaName } = require('./activity.constants')

const ruleBuilder = session => {
  const anonRules = [{
    subject: SchemaName,
    action: Action.LIST,
    conditions: { status: ActivityStatus.ACTIVE }
  }, {
    subject: SchemaName,
    action: Action.CREATE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.READ,
    conditions: { status: ActivityStatus.ACTIVE }
  }, {
    subject: SchemaName,
    action: Action.UPDATE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }]

  const activityProviderAbilities = [{
    subject: SchemaName,
    action: Action.LIST,
    conditions: { status: ActivityStatus.ACTIVE }
  }, {
    subject: SchemaName,
    action: Action.LIST,
    conditions: { owner: session.me._id }
  }, {
    subject: SchemaName,
    action: Action.CREATE
  }, {
    subject: SchemaName,
    action: Action.READ,
    conditions: { status: ActivityStatus.ACTIVE }
  }, {
    subject: SchemaName,
    action: Action.READ,
    conditions: { owner: session.me._id }
  }, {
    subject: SchemaName,
    action: Action.UPDATE,
    conditions: { owner: session.me._id }
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }]

  const orgAdminAbilities = anonRules.slice(0)

  if (session.me._id && session.me.orgAdminFor.length > 0) {
    orgAdminAbilities.push({
      subject: SchemaName,
      action: Action.LIST,
      conditions: { offerOrg: { $in: session.me.orgAdminFor } }
    }, {
      subject: SchemaName,
      action: Action.CREATE
    }, {
      subject: SchemaName,
      action: Action.READ,
      conditions: { offerOrg: { $in: session.me.orgAdminFor } }
    }, {
      subject: SchemaName,
      action: Action.UPDATE,
      conditions: { offerOrg: { $in: session.me.orgAdminFor } }
    }, {
      subject: SchemaName,
      action: Action.DELETE,
      inverted: true
    })
  }

  const adminAbilities = [{
    subject: SchemaName,
    action: Action.LIST
  }, {
    subject: SchemaName,
    action: Action.CREATE
  }, {
    subject: SchemaName,
    action: Action.READ
  }, {
    subject: SchemaName,
    action: Action.UPDATE
  }, {
    subject: SchemaName,
    action: Action.DELETE
  }]

  return {
    [Role.ANON]: anonRules,
    [Role.BASIC]: anonRules,
    [Role.VOLUNTEER]: anonRules,
    [Role.ACTIVITY_PROVIDER]: activityProviderAbilities,
    [Role.ORG_ADMIN]: orgAdminAbilities,
    [Role.ADMIN]: adminAbilities
  }
}

module.exports = ruleBuilder
