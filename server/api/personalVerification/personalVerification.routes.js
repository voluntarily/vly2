const { initVerify, verifyLiveCallback } = require('./personalVerification.controller')

module.exports = server => {
  server.get('/api/verify', initVerify)
  server.get('/api/verify/live/callback', verifyLiveCallback)
}
