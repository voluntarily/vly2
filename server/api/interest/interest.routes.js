const mongooseCrudify = require('@voluntarily/mongoose-crudify')
const helpers = require('../../services/helpers')
const { Interest } = require('./interest')
const { listInterests, getInterest, updateInterest, createInterest, deleteInterest } = require('./interest.controller')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { InterestSchemaName } = require('./interest.constants')

module.exports = server => {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/interests',
    mongooseCrudify({
      Model: Interest,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      beforeActions: [
        {
          middlewares: [authorizeActions(InterestSchemaName)]
        }
      ],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: listInterests,
        read: getInterest,
        update: updateInterest,
        create: createInterest,
        delete: deleteInterest
      },
      afterActions: [
        // this is the place to require user be authed.
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
