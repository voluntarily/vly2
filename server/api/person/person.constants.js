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
  IMG_URL: 'imgUrl',
  IMG_URL_SMALL: 'imgUrlSm',
  FACEBOOK: 'facebook',
  WEBSITE: 'website',
  TWITTER: 'twitter',
  ROLE: 'role',
  STATUS: 'status',
  PRONOUN: 'pronoun',
  TAGS: 'tags',
  TOPIC_GROUPS: 'topicGroups',
  EDUCATION: 'education',
  JOB: 'job',
  SENDEMAILNOTIFICATIONS: 'sendEmailNotifications',
  PLACEOFWORK: 'placeOfWork',
  DOB: 'dob',
  ADDRESS: 'address',
  VERIFIED: 'verified'
}

/* This list is currently used for requests returning a LIST
of people, it contains fields required for the person card.
*/
const PersonListFields = [
  PersonFields.NICKNAME,
  PersonFields.LANGUAGE,
  PersonFields.NAME,
  PersonFields.STATUS,
  PersonFields.IMG_URL,
  PersonFields.IMG_URL_SMALL,
  PersonFields.ROLE,
  PersonFields.PRONOUN,
  PersonFields.TAGS,
  PersonFields.TOPIC_GROUPS,
  PersonFields.LOCATIONS,
  PersonFields.SENDEMAILNOTIFICATIONS,
  PersonFields.VERIFIED
]

const PersonPublicFields = [
  ...PersonListFields,
  PersonFields.ABOUT,
  PersonFields.FACEBOOK,
  PersonFields.WEBSITE,
  PersonFields.TWITTER
]

const PersonFriendFields = [
  ...PersonPublicFields,
  PersonFields.EMAIL,
  PersonFields.PHONE,
  PersonFields.EDUCATION,
  PersonFields.JOB,
  PersonFields.PLACEOFWORK
]

const PersonStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  HOLD: 'hold'
}

module.exports = {
  SchemaName,
  PersonRoutes,
  PersonFields,
  PersonStatus,
  PersonListFields,
  PersonPublicFields,
  PersonFriendFields
}
