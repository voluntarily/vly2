const Activity = require('../activity/activity')
const Opportunity = require('../opportunity/opportunity')
const { OpportunityStatus } = require('../opportunity/opportunity.constants')
const { orgProfileCompletenessById } = require('../organisation/organisation.lib')
const { personProfileCompletenessById, personHasBadge } = require('../person/person.lib')
const { findOrgByPersonIdAndRole } = require('../member/member.lib')
const { personInterestCount } = require('../interest/interest.lib')
const { OrganisationRole } = require('../organisation/organisation.constants')
/* Note These library functions call the database.
They can fail and throw exceptions, we don't catch them here but
allow them to be caught at the API layer where we can return a 4xx result
*/
const GoalTests = {
  orgCompleteness: async (personalGoal, group) => {
    const personId = personalGoal.person._id
    const orgid = await findOrgByPersonIdAndRole(personId, group)
    return orgProfileCompletenessById(orgid)
  },
  personCompleteness: (personalGoal) => {
    const personId = personalGoal.person._id
    return personProfileCompletenessById(personId)
  },
  personBadged: (personalGoal) => {
    return personHasBadge(personalGoal.person, personalGoal.goal.badgeclass)
  },
  // test whether a person has an interested record in an opportunity
  personInterested: async (personalGoal) => {
    const count = await personInterestCount(personalGoal.person._id)
    return count > 0
  },
  // test whether an op has been created from an activity for current person or org
  activityStarted: async (personalGoal, activitySlug) => {
    try {
      // get id of activity matching activitySlug
      const act = await Activity.findOne({ slug: activitySlug }, 'name').exec()
      if (!act) return false
      // get org of person
      const personid = personalGoal.person._id
      const orgid = await findOrgByPersonIdAndRole(personid, OrganisationRole.OPPORTUNITY_PROVIDER)
      const query = { // find all opportunities where
        offerOrg: orgid, // its my school and
        fromActivity: act._id, // its the requested activity and
        status: { $in: [OpportunityStatus.ACTIVE, OpportunityStatus.COMPLETED] } // op is live
      }
      const ops = await Opportunity.find(query, 'name, status')
      // should we check published status here?
      return ops.length > 0
    } catch (e) { // whatever the reason for exception the test will fail
      console.error('activityStarted:', e)
      return false
    }
  }
}

module.exports = {
  GoalTests
}
