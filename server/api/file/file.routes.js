const { uploadFile } = require('./file.controller')

module.exports = server => {
  server.post('/api/files', uploadFile)
}
