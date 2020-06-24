const { getSummary } = require('./statistics.controller')

module.exports = (server) => {
  server.get('/api/statistics/summary/:orgId/:timeframe', getSummary)
}
