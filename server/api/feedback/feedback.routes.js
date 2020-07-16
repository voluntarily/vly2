const { createFeedback } = require('./feedback.controller')
const { SchemaName } = require('./feedback.constants')
const {
  authorizeActions
} = require('../../middleware/authorize/authorizeRequest')

module.exports = (server) => {
  server.use('/api/feedback', authorizeActions(SchemaName))
  // server.get("/api/feedback");
  // server.get("/api/feedback/:_id");
  server.post('/api/feedback', createFeedback)
  // server.put("/api/feedback/:_id");
  // server.delete("/api/feedback/:_id");
}
