const mongooseCrudify = require('mongoose-crudify')

const helpers = require('../../services/helpers')
const Person = require('./person')
const { verifyEmailPerson, ensureSanitized, getPersonBy } = require('./person.controller')

module.exports = function (server) {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/people',
    mongooseCrudify({
      Model: Person,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      beforeActions: [
        { middlewares: [ensureSanitized], only: ['create', 'update'] }

      ],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      afterActions: [
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )

  server.get('/api/person/verify_email/:id', verifyEmailPerson)
  server.get('/api/person/by/:by/:value', getPersonBy)
}
