const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const Goal = require('./goal')
const { getGoals } = require('./goal.controller')

module.exports = function (server) {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/goals',
    mongooseCrudify({
      Model: Goal,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      // beforeActions: [],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: getGoals
      },
      afterActions: [
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
