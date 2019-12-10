const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const archivedOpportunity = require('./archivedOpportunity')
const { getArchivedOpportunities, getArchivedOpportunity } = require('./archivedOpportunity.controller')

module.exports = (server) => {
  server.use(
    '/api/archivedOpportunities',
    mongooseCrudify({
      Model: archivedOpportunity,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      actions: {
        list: getArchivedOpportunities,
        read: getArchivedOpportunity
      },
      afterActions: [
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
