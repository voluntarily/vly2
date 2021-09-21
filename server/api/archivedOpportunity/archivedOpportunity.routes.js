const mongooseCrudify = require('@voluntarily/mongoose-crudify')
const helpers = require('../../services/helpers')
const ArchivedOpportunity = require('./archivedOpportunity')
const { getArchivedOpportunities, getArchivedOpportunity } = require('./archivedOpportunity.controller')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const removeUnauthorizedFields = require('../../services/authorize/removeUnauthorizedFields')
const { SchemaName } = require('./archivedOpportunity.constants')

module.exports = (server) => {
  server.use(
    '/api/archivedOpportunities',
    mongooseCrudify({
      Model: ArchivedOpportunity,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [
        {
          middlewares: [authorizeActions(SchemaName)]
        }
      ],
      actions: {
        list: getArchivedOpportunities,
        read: getArchivedOpportunity
      },
      afterActions: [
        {
          middlewares: [removeUnauthorizedFields(ArchivedOpportunity)]
        },
        {
          middlewares: [helpers.formatResponse]
        }
      ]
    })
  )
}
