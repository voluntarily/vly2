const { dbAction } = require('./db.controller')

module.exports = (server) => {
  server.get('/api/db/:action/', dbAction)
}
