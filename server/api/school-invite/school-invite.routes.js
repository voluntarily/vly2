const { SchoolInvite } = require('./school-invite.controller')

module.exports = (server) => {
  server.post('/api/notify/school-invite', SchoolInvite.send)
  server.get('/api/notify/school-invite/accept', SchoolInvite.accept)
}
