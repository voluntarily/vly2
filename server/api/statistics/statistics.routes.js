const {
  getSummary,
  getLocations,
  getActivityTags
} = require('./statistics.controller')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { Subject } = require('./statistics.constants')

module.exports = (server) => {
  server.use('/api/statistics', authorizeActions(Subject))
  server.get('/api/statistics/summary/:orgId/:timeframe', getSummary)
  server.get('/api/statistics/locations/:orgId/:timeframe', getLocations)
  server.get('/api/statistics/activityTags/:orgId/:timeframe', getActivityTags)
}
