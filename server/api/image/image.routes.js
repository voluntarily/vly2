const imageController = require('./image.controller')

module.exports = server => {
  server.post('/api/images', imageController)
}
