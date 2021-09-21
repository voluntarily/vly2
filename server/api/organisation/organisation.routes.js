const mongooseCrudify = require('@voluntarily/mongoose-crudify')
const helpers = require('../../services/helpers')
const Organisation = require('./organisation')
const { listOrganisations, putOrganisation, postOrganisation, deleteOrganisation } = require('./organisation.controller')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { SchemaName } = require('./organisation.constants')
const { initializeGroups } = require('../../util/initTags')

module.exports = function (server) {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/organisations',
    mongooseCrudify({
      Model: Organisation,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      beforeActions: [
        {
          middlewares: [authorizeActions(SchemaName)]
        }, {
          middlewares: [initializeGroups],
          only: ['create', 'update']
        }],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: listOrganisations,
        update: putOrganisation,
        create: postOrganisation,
        delete: deleteOrganisation
      },
      afterActions: [
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
