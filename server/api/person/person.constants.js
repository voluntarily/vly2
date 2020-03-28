const { Action } = require('../../services/abilities/ability.constants')

const SchemaName = 'Person'

const PersonRoutes = {
  [Action.LIST]: '/api/people',
  [Action.READ]: '/api/people/:id',
  [Action.UPDATE]: '/api/people/:id',
  [Action.CREATE]: '/api/people'
}
const PersonFields = {
  ID: '_id',
  EMAIL: 'email',
  NICKNAME: 'nickname',
  NAME: 'name',
  ABOUT: 'about',
  LOCATIONS: 'locations',
  PHONE: 'phone',
  LANGUAGE: 'language',
  AVATAR: 'imgUrl',
  FACEBOOK: 'facebook',
  WEBSITE: 'website',
  TWITTER: 'twitter',
  ROLE: 'role',
  STATUS: 'status',
  PRONOUN: 'pronoun',
  TAGS: 'tags',
  EDUCATION: 'education',
  JOB: 'job',
  SENDEMAILNOTIFICATIONS: 'sendEmailNotifications',
  PLACEOFWORK: 'placeOfWork'
}

const PersonStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  HOLD: 'hold'
}

module.exports = {
  SchemaName,
  PersonRoutes,
  PersonFields,
  PersonStatus
}
