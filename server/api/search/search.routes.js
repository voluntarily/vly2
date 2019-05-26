const { searchOpportunities } = require('./search.controller')

module.exports = function (server) {
  server.get('/api/search', searchOpportunities)
}
