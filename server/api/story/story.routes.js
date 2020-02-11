const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const Story = require('./story')
const { listStory, getStory, putStory } = require('./story.controller')
const { SchemaName, StoryRoutes } = require('./story.constants')
const initializeTags = require('../../util/initTags')
const { Action } = require('../../services/abilities/ability.constants')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')

const convertRequestToAction = (req) => {
  switch (req.method) {
    case 'GET':
      return req.route.path === StoryRoutes[Action.READ] ? Action.READ : Action.LIST
    case 'POST':
      return Action.CREATE
    case 'PUT':
      return Action.UPDATE
    case 'DELETE':
      return Action.DELETE
    default:
      return Action.READ
  }
}

module.exports = (server) => {
  server.use(
    '/api/stories',
    mongooseCrudify({
      Model: Story,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [{
        middlewares: [authorizeActions(SchemaName, convertRequestToAction), initializeTags],
        only: ['create', 'update']
      }],
      // actions: {}, // read (GET), update (PUT), list (LIST)
      actions: {
        list: listStory,
        read: getStory,
        update: putStory
      },
      afterActions: [
        // this is the place to require user be authed.
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
