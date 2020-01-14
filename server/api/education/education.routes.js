const getEducation = require('./education.controller')

module.exports = (server) => {
  server.get('/api/education', getEducation)
}
