const {
  createFeedback,
  listFeedback,
  getFeedback,
  updateFeedback
} = require('./feedback.controller')
const { SchemaName } = require('./feedback.constants')
const {
  authorizeActions
} = require('../../middleware/authorize/authorizeRequest')

module.exports = (server) => {
  server.use('/api/feedback', authorizeActions(SchemaName))
  server.get('/api/feedback', listFeedback)
  server.get('/api/feedback/:_id', getFeedback)
  server.post('/api/feedback', createFeedback)
  server.put('/api/feedback/:_id', updateFeedback)
  // server.delete("/api/feedback/:_id");
}
