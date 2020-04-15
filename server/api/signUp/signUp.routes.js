const { registerPerson } = require('./signUp.controller')

module.exports = server => {
  server.post('/api/signup', registerPerson)
}
