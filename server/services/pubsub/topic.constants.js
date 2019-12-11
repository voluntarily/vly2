/* List all pub/sub topics here using constants to avoid misspellings etc
  dot is used to create a heirarchy for subscriptions. we use double underscore in the
  constants.
*/
const Topic = {
  TOPIC_API__HEALTH: Symbol('API.HEALTH'), // /api/health called
  TOPIC_PERSON__CREATE: Symbol('PERSON.CREATE') // new person created
}

module.exports = Topic
