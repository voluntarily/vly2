const Activity = require('../activity/activity')
const Opportunity = require('../opportunity/opportunity')
const { OpportunityStatus } = require('../opportunity/opportunity.constants')
const { orgProfileCompletenessById } = require('../organisation/organisation.lib')
const { findOrgByPersonIdAndCategory } = require('../member/member.lib')
/* Note These library functions call the database.
They can fail and throw exceptions, we don't catch them here but
allow them to be caught at the API layer where we can return a 4xx result
*/
const GoalTests = {
  orgCompleteness: async (personalGoal, category) => {
    const personId = personalGoal.person._id
    const orgid = await findOrgByPersonIdAndCategory(personId, category)
    return orgProfileCompletenessById(orgid)
  },
  // test whether an op has been created from an activity for current person or org
  activityStarted: async (personalGoal, activitySlug) => {
    try {
      // get id of activity matching activitySlug
      const act = await Activity.findOne({ slug: activitySlug }, 'name').exec()
      if (!act) return false
      // get org of person
      const personid = personalGoal.person._id
      const orgid = await findOrgByPersonIdAndCategory(personid, 'op')
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
