const mongooseCrudify = require('@voluntarily/mongoose-crudify')
const helpers = require('../../services/helpers')
const Opportunity = require('./opportunity')
const {
  ensureSanitized,
  listOpportunities,
  getOpportunity,
  putOpportunity,
  deleteOpportunity,
  getOpportunityRecommendations,
  createOpportunity
} = require('./opportunity.controller')
const { SchemaName } = require('./opportunity.constants')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { initializeTags } = require('../../util/initTags')
const removeUnauthorizedFields = require('../../services/authorize/removeUnauthorizedFields')

module.exports = (server) => {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.get('/api/opportunities/recommended', getOpportunityRecommendations)
  server.use(
    '/api/opportunities',
    mongooseCrudify({
      Model: Opportunity,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [{
        middlewares: [authorizeActions(SchemaName), ensureSanitized]
      }, {
        middlewares: [initializeTags],
        only: ['create', 'update']
      }],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: listOpportunities,
        read: getOpportunity,
        update: putOpportunity,
        delete: deleteOpportunity,
        create: createOpportunity
      },
      afterActions: [{
        middlewares: [removeUnauthorizedFields(Opportunity), helpers.formatResponse]
      }]
    })
  )
}
