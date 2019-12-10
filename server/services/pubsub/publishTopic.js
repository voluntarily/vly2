const PubSub = require('pubsub-js')
const { TOPIC_PERSON__CREATE } = require('./topic.constants')

/*  middleware that will publish an event when a new entity is created
*/
const publishCreate = (Schema) => (req, res, next) => {
  // need schema name here to generate topic dynamically

  if (Array.isArray(req.crudify.result)) {
    req.crudify.result = req.crudify.result.map(
      person =>
        PubSub.publish(TOPIC_PERSON__CREATE, person)
    )
  } else {
    PubSub.publish(TOPIC_PERSON__CREATE, req.crudify.result)
  }
  next()
}

module.exports = {
  publishCreate
}
