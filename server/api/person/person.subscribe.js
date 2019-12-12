// const { addPersonalGoalGroup } = require('../personalGoal/personalGoal.lib')
const PubSub = require('pubsub-js')
const { TOPIC_PERSON__CREATE } = require('../../services/pubsub/topic.constants')

module.exports = (server) => {
  PubSub.subscribe(TOPIC_PERSON__CREATE, async (msg, person) => {
    console.log('new person created:', msg, person)
    // await addPersonalGoalGroup('Getting Started', person._id)
  })
}
