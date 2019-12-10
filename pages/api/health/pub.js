const PubSub = require('pubsub-js')
const { TOPIC_API__HEALTH } = require('../../../server/services/pubsub/topic.constants')

/* The /api/health/pub endpoint allows you to
   publish a message on a certain topic
*/
export default (req, res) => {
  console.log('Publish:', req.query.msg)

  // Whenever the health endpoint is called we publish the result internally
  PubSub.publish(TOPIC_API__HEALTH, req.query)

  res.status(200).json(req.query.msg)
}
