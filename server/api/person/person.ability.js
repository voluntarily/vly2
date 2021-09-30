import { Role } from '../../services/authorize/role.js'
import { Action } from '../../services/abilities/ability.constants.js'
import { PersonFields } from './person.constants.js'
const SchemaName = 'Person'

// WIKI rules : https://voluntarily.atlassian.net/wiki/spaces/VP/pages/18677761/API+Access+Security+Rules
const ruleBuilder = session => {
  // https://github.com/stalniy/casl/issues/229
  // block all api call for non log in user
  const anonAbilities = [{
    subject: SchemaName,
    action: Action.CRUD,
    inverted: true
  }, {
    subject: SchemaName,
    action: Action.CREATE
  }]

  const basicRules = [
    {
      subject: SchemaName,
      action: Action.READ
    }, {
      subject: SchemaName,
      action: Action.LIST,
      fields: [
        PersonFields.ID,
        PersonFields.NICKNAME,
        PersonFields.LANGUAGE,
        PersonFields.STATUS,
        PersonFields.IMG_URL,
        PersonFields.NAME,
        PersonFields.ROLE,
        PersonFields.ABOUT,
        PersonFields.PRONOUN,
        PersonFields.TAGS,
        PersonFields.FACEBOOK,
        PersonFields.WEBSITE,
        PersonFields.TWITTER
      ]
    }, {
      subject: SchemaName,
      action: Action.DELETE
    }, {
      subject: SchemaName,
      action: Action.CREATE,
      inverted: true
    }, {
      subject: SchemaName,
      action: Action.UPDATE
    }]

  const adminAbilities = [{
    subject: SchemaName,
    action: Action.READ
  }, {
    subject: SchemaName,
    action: Action.LIST
  }, {
    subject: SchemaName,
    action: Action.DELETE
  }, {
    subject: SchemaName,
    action: Action.CREATE
  }, {
    subject: SchemaName,
    action: Action.UPDATE
  }]

  return {
    [Role.ANON]: anonAbilities,
    [Role.BASIC]: basicRules,
    [Role.VOLUNTEER]: basicRules,
    [Role.OPPORTUNITY_PROVIDER]: basicRules,
    [Role.ADMIN]: adminAbilities,
    [Role.ACTIVITY_PROVIDER]: basicRules,
    [Role.SUPPORT]: basicRules,
    [Role.ALL]: basicRules,
    [Role.ORG_ADMIN]: adminAbilities
  }
}

export default ruleBuilder
