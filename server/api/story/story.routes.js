const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const Story = require('./story')
const { listStory, getStory } = require('./story.controller')
const initializeTags = require('../../util/initTags')

module.exports = (server) => {
  server.use(
    '/api/stories',
    mongooseCrudify({
      Model: Story,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [{
        middlewares: [initializeTags],
        only: ['create', 'update']
      }],
      // actions: {}, // read (GET), update (PUT), list (LIST)
      actions: {
        list: listStory,
        read: getStory
        // update: putStory
      },
      afterActions: [
        // this is the place to require user be authed.
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}