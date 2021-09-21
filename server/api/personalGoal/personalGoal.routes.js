const mongooseCrudify = require('@voluntarily/mongoose-crudify')
const helpers = require('../../services/helpers')
const PersonalGoal = require('./personalGoal')
const { listPersonalGoals, updatePersonalGoal, createPersonalGoal } = require('./personalGoal.controller')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { SchemaName } = require('./personalGoal.constants')

module.exports = server => {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/personalGoals',
    mongooseCrudify({
      Model: PersonalGoal,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      beforeActions: [
        {
          middlewares: [authorizeActions(SchemaName)]
        }
      ],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: listPersonalGoals,
        update: updatePersonalGoal,
        create: createPersonalGoal
      },
      afterActions: [
        // this is the place to require user be authed.
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
