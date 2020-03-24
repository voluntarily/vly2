const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const Activity = require('./activity')
const { listActivities, getActivity, putActivity, createActivity } = require('./activity.controller')
const { findActivity } = require('./activity.lib')
const { initializeTags } = require('../../util/initTags')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { SchemaName } = require('./activity.constants')

module.exports = (server) => {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/activity/:slug',
    findActivity
  )
  server.use(
    '/api/activities',
    mongooseCrudify({
      Model: Activity,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [
        {
          middlewares: [authorizeActions(SchemaName)]
        },
        {
          middlewares: [initializeTags],
          only: ['create', 'update']
        }
      ],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: listActivities,
        create: createActivity,
        read: getActivity,
        update: putActivity
      },
      afterActions: [
        // this is the place to require user be authed.
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
