/* List all pub/sub topics here using constants to avoid misspellings etc
  dot is used to create a heirarchy for subscriptions. we use double underscore in the
  constants.
*/
const Topic = {
  TOPIC_API__HEALTH: Symbol('API.HEALTH'), // /api/health called
  TOPIC_PERSON__CREATE: Symbol('PERSON.CREATE'), // new person created via API
  TOPIC_MEMBER__UPDATE: Symbol('MEMBER.UPDATE'), // membership changed via service
  TOPIC_INTEREST__UPDATE: Symbol('INTEREST.UPDATE'), // interest changed via service
  TOPIC_INTEREST__MESSAGE: Symbol('INTEREST.MESSAGE'), // interest message via service
  TOPIC_INTEREST__DELETE: Symbol('INTEREST.DELETE'), // interest withdrawn
  TOPIC_GOALGROUP__ADD: Symbol('GOALGROUP.ADD'), // goal group added to person
  TOPIC_PERSON__EMAIL_SENT: Symbol('PERSON.EMAIL_SENT') // email sent to a person
}

module.exports = Topic
