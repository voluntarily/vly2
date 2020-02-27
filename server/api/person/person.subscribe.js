const { emailPerson } = require('./person.email')
const { config } = require('../../../config/clientConfig')
const PubSub = require('pubsub-js')
const { TOPIC_PERSON__CREATE, TOPIC_MEMBER__UPDATE, TOPIC_PERSON__EMAIL_SENT } = require('../../services/pubsub/topic.constants')
const { MemberStatus } = require('../member/member.constants')

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

  PubSub.subscribe(TOPIC_MEMBER__UPDATE, async (msg, member) => {
    // a new member has been created or a member status has changed
    // send email to let people know

    // skip states without emails
    if ([MemberStatus.NONE, MemberStatus.JOINER, MemberStatus.EXMEMBER]
      .includes(member.status)) {
      return
    }
    const org = member.organisation
    org.href = `${config.appUrl}/orgs/${org._id}`
    org.imgUrl = new URL(org.imgUrl, config.appUrl).href
    const template = `member_${member.status}`
    const info = await emailPerson(template, member.person, {
      send: true,
      from: welcomeFrom,
      org
    })
    PubSub.publish(TOPIC_PERSON__EMAIL_SENT, info)
  })
}
