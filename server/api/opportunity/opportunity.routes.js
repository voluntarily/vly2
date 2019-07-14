const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const Opportunity = require('./opportunity')
const { getOpportunities, getOpportunity, putOpportunity } = require('./opportunity.controller')
const { authorizeOpportunityActions, authorizeOpportunityFields } = require('./opportunity.authorize')
const initializeTags = require('../../util/initTags')

module.exports = (server) => {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/opportunities',
    mongooseCrudify({
      Model: Opportunity,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [{
        middlewares: [authorizeOpportunityActions]
      },
      {
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
        middlewares: [authorizeOpportunityFields, helpers.formatResponse]
      }]
    })
  )
}
