const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const ArchivedOpportunity = require('./archivedOpportunity')
const { getArchivedOpportunities, getArchivedOpportunity } = require('./archivedOpportunity.controller')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const removeUnauthorizedFields = require('../../services/authorize/removeUnauthorizedFields')
const { SchemaName } = require('./archivedOpportunity.constants')
const { Action } = require('../../services/abilities/ability.constants')

const convertRequestToAction = (req) => {
  switch (req.method) {
    case 'GET':
      return req.route.path === '/' ? Action.LIST : Action.READ
    case 'POST':
      return Action.CREATE
    case 'PUT':
      return Action.UPDATE
    case 'DELETE':
      return Action.DELETE
    default:
      return Action.READ
  }
}

module.exports = (server) => {
  server.use(
    '/api/archivedOpportunities',
    mongooseCrudify({
      Model: ArchivedOpportunity,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [
        {
          middlewares: [authorizeActions(SchemaName, convertRequestToAction)]
        }
      ],
      actions: {
        list: getArchivedOpportunities,
        read: getArchivedOpportunity
      },
      afterActions: [
        {
          middlewares: [removeUnauthorizedFields(ArchivedOpportunity, convertRequestToAction)]
        },
        {
          middlewares: [helpers.formatResponse]
        }
      ]
    })
  )
}
