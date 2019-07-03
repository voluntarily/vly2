const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const Opportunity = require('./opportunity')
const { getOpportunities, getOpportunity } = require('./opportunity.controller')
const { authorizeOpportunityActions, authorizeOpportunityFields } = require('./opportunity.authorize')

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
      }],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: getOpportunities,
        read: getOpportunity
      },
      afterActions: [{
        middlewares: [authorizeOpportunityFields, helpers.formatResponse]
      }]
    })
  )
}
