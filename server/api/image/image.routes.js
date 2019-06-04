const postImage = require('./image.controller')

module.exports = server => {
  server.post('/api/images', postImage)
}
