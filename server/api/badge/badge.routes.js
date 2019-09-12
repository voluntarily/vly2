const { issueNewBadge } = require('./badge.controller')

module.exports = (server) => {
  server.post('/api/badge/:badgeName', issueNewBadge)
}
