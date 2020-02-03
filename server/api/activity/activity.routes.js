const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const Activity = require('./activity')
const { getActivities, getActivity, putActivity, createActivity } = require('./activity.controller')
const { findActivity } = require('./findActivity')
const initializeTags = require('../../util/initTags')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { Action } = require('../../services/abilities/ability.constants')
const { SchemaName } = require('./activity.constants')

const convertRequestToAction = (req) => {
  switch (req.method) {
    case 'GET':
      return req.route.path === '/' ? Action.LIST : Action.READ
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
          middlewares: [authorizeActions(SchemaName, convertRequestToAction)]
        },
        {
          middlewares: [initializeTags],
          only: ['create', 'update']
        }
      ],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: getActivities,
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
