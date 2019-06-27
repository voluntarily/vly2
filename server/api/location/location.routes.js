const getLocations = require('./location.controller')

module.exports = (server) => {
  server.get('/api/locations', getLocations)
}
