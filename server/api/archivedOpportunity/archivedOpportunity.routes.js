const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const archivedOpportunity = require('./archivedOpportunity')

module.exports = (server) => {
  server.use(
    '/api/archivedOpportunities',
    mongooseCrudify({
      Model: archivedOpportunity,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      afterActions: [
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
