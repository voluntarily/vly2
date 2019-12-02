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
  PHONE: 'phone',
  GENDER: 'gender',
  LANGUAGE: 'language',
  AVATAR: 'imgUrl',
  FACEBOOK: 'facebook',
  WEBSITE: 'website',
  TWITTER: 'twitter',
  ROLE: 'role',
  STATUS: 'status',
  PRONOUN: 'pronoun',
<<<<<<< HEAD
  EDUCATION: 'education'
=======
  TAGS: 'tags'
>>>>>>> c55b35b91c1ad3893c792b1caed661c1502b7f1e
}

module.exports = {
  SchemaName,
  PersonRoutes,
  PersonFields
}
