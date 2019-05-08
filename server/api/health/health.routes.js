const getHealth = require('./health.controller')

module.exports = (server) => {
  server.get('/api/health/', getHealth)
  server.get('/api/health/:param1/', getHealth)
  server.get('/api/health/:param1/:param2', getHealth)
}
