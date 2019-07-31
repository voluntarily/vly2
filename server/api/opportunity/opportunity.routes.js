const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const Opportunity = require('./opportunity')
const { Action } = require('../../services/abilities/ability.constants')
const { getOpportunities, getOpportunity, putOpportunity } = require('./opportunity.controller')
const { SchemaName, OpportunityRoutes } = require('./opportunity.constants')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const initializeTags = require('../../util/initTags')

const convertRequestToAction = (req) => {
  switch (req.method) {
    case 'GET':
      return req.route.path === OpportunityRoutes[Action.READ] ? Action.READ : Action.LIST
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
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/opportunities',
    mongooseCrudify({
      Model: Opportunity,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [{
        middlewares: [authorizeActions(SchemaName, convertRequestToAction)]
      }, {
        middlewares: [initializeTags],
        only: ['create', 'update']
      }],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: getOpportunities,
        read: getOpportunity,
        update: putOpportunity
      },
      afterActions: [{
        middlewares: [helpers.formatResponse]
      }]
    })
  )
}
