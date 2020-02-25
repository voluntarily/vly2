const { emailPerson } = require('./person.email')
const { config } = require('../../../config/clientConfig')
const PubSub = require('pubsub-js')
const { TOPIC_PERSON__CREATE, TOPIC_PERSON__EMAIL_SENT } = require('../../services/pubsub/topic.constants')

/**
 * This will be easier to add more status without having too much if. All we need is add another folder in email template folder and the status will reference to that folder
 * @param {string} template status will be used to indicate which email template to use
 * @param {object} to person email is for. (requestor or volunteer) with email populated.
 * @param {object} props extra properties such as attachment
 */
const welcomeFrom = {
  nickname: 'Welcome',
  name: 'The team at Voluntarily',
  email: 'welcome@voluntarily.nz'
}

module.exports = (server) => {
  PubSub.subscribe(TOPIC_PERSON__CREATE, async (msg, person) => {
    person.href = `${config.appUrl}/home`
    const info = await emailPerson('welcome', person, {
      send: true,
      from: welcomeFrom
    })
    PubSub.publish(TOPIC_PERSON__EMAIL_SENT, info)
  })
}
