// const { addPersonalGoalGroup } = require('../personalGoal/personalGoal.lib')
const PubSub = require('pubsub-js')
const { TOPIC_PERSON__CREATE, TOPIC_MEMBER__UPDATE } = require('../../services/pubsub/topic.constants')
const { addPersonalGoalGroup } = require('./personalGoal.lib')
const { MemberStatus } = require('../member/member.constants')
const Organisation = require('../organisation/organisation')
const { OrganisationRole } = require('../organisation/organisation.constants')
const { GoalGroup } = require('../goal/goalGroup.js')

module.exports = (server) => {
  PubSub.subscribe(TOPIC_PERSON__CREATE, async (msg, person) => {
    addPersonalGoalGroup(GoalGroup.VP_NEW, person._id)
  })

  PubSub.subscribe(TOPIC_MEMBER__UPDATE, async (msg, member) => {
    // a new member has been created or a member status has changed
    // issue new cards accordingly.
    const orgid = member.organisation
    const org = await Organisation.findById(orgid)
    switch (member.status) {
      case MemberStatus.ORGADMIN:
        if (org.role.includes(OrganisationRole.VOLUNTEER_PROVIDER)) { await addPersonalGoalGroup(GoalGroup.ORG_VP_NEW, member.person) }
        if (org.role.includes(OrganisationRole.OPPORTUNITY_PROVIDER)) { await addPersonalGoalGroup(GoalGroup.ORG_OP_NEW, member.person) }
        if (org.role.includes(OrganisationRole.ACTIVITY_PROVIDER)) { await addPersonalGoalGroup(GoalGroup.ORG_AP_NEW, member.person) }
        break
      case MemberStatus.FOLLOWER:
        break
      case MemberStatus.JOINER:
        break
      case MemberStatus.VALIDATOR:
        break
      case MemberStatus.MEMBER:
        break
      case MemberStatus.EXMEMBER:
        break
    }
  })
}
