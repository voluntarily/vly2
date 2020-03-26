const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const PersonalVerification = require('./personalVerification')
const { initVerify } = require('./personalVerification.controller')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { SchemaName } = require('./personalVerification.constants')

module.exports = server => {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/verify',
    mongooseCrudify({
      Model: PersonalVerification,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      beforeActions: [
        {
          middlewares: [authorizeActions(SchemaName)]
        }
      ],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        read: initVerify
      },
      afterActions: [
        // this is the place to require user be authed.
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
