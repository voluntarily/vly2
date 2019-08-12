const mongooseCrudify = require('mongoose-crudify')

const helpers = require('../../services/helpers')
const Person = require('./person')
const { ensureSanitized, getPersonBy, updatePersonDetail } = require('./person.controller')
const { SchemaName } = require('./person.constants')
const removeUnauthorizedFields = require('../../services/authorize/removeUnauthorizedFields')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')

module.exports = function (server) {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/people',
    mongooseCrudify({
      Model: Person,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      actions: {
        update: updatePersonDetail
      },
      beforeActions: [{ middlewares: [ authorizeActions(SchemaName), ensureSanitized ] }],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      afterActions: [{ middlewares: [ removeUnauthorizedFields(Person), helpers.formatResponse ] }]
    })
  )

  server.get('/api/person/by/:by/:value', getPersonBy)
}
