const { SchoolInvite } = require('./school-invite.controller')

module.exports = (server) => {
  server.post('/api/notify/school-invite', SchoolInvite.send)
}
