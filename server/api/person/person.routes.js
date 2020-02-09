const mongooseCrudify = require('mongoose-crudify')

const helpers = require('../../services/helpers')
const Person = require('./person')
const { ensureSanitized, listPeople, getPerson, updatePersonDetail } = require('./person.controller')
const { SchemaName } = require('./person.constants')
const removeUnauthorizedFields = require('../../services/authorize/removeUnauthorizedFields')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { publishCreate } = require('../../services/pubsub/publishTopic')
const initializeTags = require('../../util/initTags')
module.exports = function (server) {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/people',
    mongooseCrudify({
      Model: Person,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [
        {
          middlewares: [authorizeActions(SchemaName), ensureSanitized]
        },
        {
          middlewares: [initializeTags],
          only: ['create', 'update']
        }],
      actions: {
        list: listPeople,
        read: getPerson,
        update: updatePersonDetail
      },
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      afterActions: [
        {
          middlewares: [publishCreate(Person)],
          only: ['create']
        },
        {
          middlewares: [removeUnauthorizedFields(Person)],
          except: ['create']
        },
        {
          middlewares: [helpers.formatResponse]
        }
      ]
    })
  )
}
