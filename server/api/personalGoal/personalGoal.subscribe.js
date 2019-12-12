// const { addPersonalGoalGroup } = require('../personalGoal/personalGoal.lib')
const PubSub = require('pubsub-js')
const { TOPIC_PERSON__CREATE } = require('../../services/pubsub/topic.constants')
const { addPersonalGoalGroup } = require('./personalGoal.lib')

module.exports = (server) => {
  PubSub.subscribe(TOPIC_PERSON__CREATE, (msg, person) => {
    addPersonalGoalGroup('Getting Started', person._id)
  })
}
