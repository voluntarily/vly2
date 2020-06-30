const { getSummary, getLocations, getActivityTags } = require('./statistics.controller')

module.exports = (server) => {
  server.get('/api/statistics/summary/:orgId/:timeframe', getSummary)
  server.get('/api/statistics/locations/:orgId/:timeframe', getLocations)
  server.get('/api/statistics/activityTags/:orgId/:timeframe', getActivityTags)
}
