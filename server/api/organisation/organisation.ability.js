const { AbilityBuilder } = require('@casl/ability')
const { SchemaName } = require('./organisation.constants')
const { Role } = require('../../services/authorize/role')
const { Action } = require('../../services/abilities/ability.constants')
const Member = require('../member/member')

/*
// TypeScript definition
interface Rule {
  actions: string | string[],
  subject: string | string[],
  conditions?: Object,
  fields?: string[],
  inverted?: boolean, // default is `false`
  reason?: string // mainly to specify why user can't do something. See forbidden reasons for details
}
*/

const ruleBuilder = (session, params) => {
  const defaultAbilities = [{
    subject: SchemaName,
    action: Action.READ
  }, {
    subject: SchemaName,
    action: Action.LIST
  }, {
    subject: SchemaName,
    action: Action.UPDATE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.CREATE,
    inverted: true
  }]

  const adminAbilities = [{ 
    subject: SchemaName, 
    action: Action.MANAGE 
  }]

  const orgAdminAbilities = [{
    subject: SchemaName,
    action: Action.READ
  }, {
    subject: SchemaName,
    action: Action.LIST
  }, {
    subject: SchemaName,
    action: Action.UPDATE
  }, {
    subject: SchemaName,
    action: Action.DELETE,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.CREATE,
    inverted: true
  }]

  console.debug(params)
  console.log('')
  console.log('')
  console.log('')
  return {
    [Role.ANON]: defaultAbilities,
    [Role.ACTIVITY_PROVIDER]: defaultAbilities,
    [Role.VOLUNTEER_PROVIDER]: defaultAbilities,
    [Role.OPPORTUNITY_PROVIDER]: defaultAbilities,
    [Role.TESTER]: defaultAbilities,
    [Role.ADMIN]: adminAbilities,
    // [Role.ORG_ADMIN]: defineAbilitiesFor(session.me, req.session)
  }
}

function defineAbilitiesFor(user, orgId) {
  console.log('org ability: ' + user._id + ", " + orgId)
  console.debug(orgId)

  return AbilityBuilder.define(async (can, cannot) => {
    if (!orgId) {
      return
    }
    if (!user) {
      return can('read', 'all')
    }

    const membership = await Member
      .findOne({
        person: user._id,
        organisation: orgId
      })
      .exec()

    if (membership) {
      can('manage', 'all')
    } else {
      can('read', 'all')
    }
  })
}

module.exports = ruleBuilder
