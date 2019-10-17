const { uploadImage } = require('./image.controller')

module.exports = server => {
  server.post('/api/images', uploadImage)
}
