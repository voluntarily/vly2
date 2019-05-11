const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const Organisation = require('./organisation')
const { getOrganisations } = require('./organisation.controller')

module.exports = function (server) {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/organisations',
    mongooseCrudify({
      Model: Organisation,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      // beforeActions: [],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: getOrganisations
      },
      afterActions: [
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
