const {
  getSummary,
  getLocations,
  getActivityTags
} = require('./statistics.controller')
const { authoriseStatistics } = require('./statistics.middleware')

module.exports = (server) => {
  server.use('/api/statistics/[^/]+/:orgId/:timeframe', authoriseStatistics)
  server.get('/api/statistics/summary/:orgId/:timeframe', getSummary)
  server.get('/api/statistics/locations/:orgId/:timeframe', getLocations)
  server.get('/api/statistics/activityTags/:orgId/:timeframe', getActivityTags)
}
