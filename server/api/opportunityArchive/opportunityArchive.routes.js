const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const OpportunityArchive = require('./opportunityArchive')

module.exports = (server) => {
  server.use(
    '/api/opportunityArchives',
    mongooseCrudify({
      Model: OpportunityArchive,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      afterActions: [
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
