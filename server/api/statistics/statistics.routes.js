const { getSummary, getLocations } = require('./statistics.controller')

module.exports = (server) => {
  server.get('/api/statistics/summary/:orgId/:timeframe', getSummary)
  server.get('/api/statistics/locations/:orgId/:timeframe', getLocations)
}
