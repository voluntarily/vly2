const { Action } = require('../../services/abilities/ability.constants')

const StoryRoutes = {
  [Action.LIST]: '/orgs',
  [Action.READ]: '/orgs/:id',
  [Action.UPDATE]: '/orgs/:id/edit',
  [Action.CREATE]: '/org/new'
}

const StoryStatus = {
  DRAFT: 'draft',
  PUBLISH: 'publish',
  CANCELLED: 'cancelled'
}

const StoryFields = {
  ID: '_id',
  NAME: 'name',
  BODY: 'body',
  IMG_URL: 'imgUrl',
  AUTHOR: 'author',
  STATUS: 'status',
  DATE_ADDED: 'dateAdded',
  DATE_PUBLISHED: 'datePublished',
  ALLOW_COMMENTS: 'allowComments',
  PARENT: 'parent',
  TAGS: 'tags'
}

module.exports = {
  SchemaName: 'Story',
  StoryStatus,
  StoryFields,
  StoryRoutes
}
