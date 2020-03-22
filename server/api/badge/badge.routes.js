const { issueNewBadge, listAllBadge, listUserBadge } = require('./badge.controller')

module.exports = (server) => {
  server.get('/api/badges', listAllBadge)
  server.post('/api/badge/:badgeID', issueNewBadge)
  server.get('/api/badge/:user', listUserBadge)
}
