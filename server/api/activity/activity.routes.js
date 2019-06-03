const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const Activity = require('./activity')
const { getActivities, getActivity } = require('./activity.controller')

module.exports = (server) => {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/activities',
    mongooseCrudify({
      Model: Activity,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      // beforeActions: [],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: getActivities,
        read: getActivity
      },
      afterActions: [
        // this is the place to require user be authed.
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
