const PersonalGoal = require('./personalGoal')
const Goal = require('../goal/goal')
const Activity = require('../activity/activity')
const Opportunity = require('../opportunity/opportunity')
const { OpportunityStatus } = require('../opportunity/opportunity.constants')
const moment = require('moment')
const { PersonalGoalStatus } = require('./personalGoal.constants')
const { orgProfileCompletenessById } = require('../organisation/organisation.lib')
const { findOrgByPersonIdAndCategory } = require('../member/member.lib')
/* Note These library functions call the database.
They can fail and throw exceptions, we don't catch them here but
allow them to be caught at the API layer where we can return a 4xx result
*/
const GoalTests = {
  orgCompleteness: async (personalGoal, category) => {
    console.log('orgCompleteness')
    const personId = personalGoal.person._id
    const orgid = await findOrgByPersonIdAndCategory(personId, category)
    return orgProfileCompletenessById(orgid)
  },
  // test whether an op has been created from an activity for current person or org
  activityStarted: async (personalGoal, activitySlug) => {
    try {
      console.log('Eval activityStarted', personalGoal, activitySlug)
      // get id of activity matching activitySlug
      const act = await Activity.findOne({ slug: activitySlug }, 'name').exec()
      console.log('Activity:', act)
      // get org of person
      const personid = personalGoal.person._id
      const orgid = await findOrgByPersonIdAndCategory(personid, 'op')
      const query = { // find all opportunities where
        offerOrg: orgid, // its my school and
        fromActivity: act._id, // its the requested activity and
        status: { $in: [OpportunityStatus.ACTIVE, OpportunityStatus.COMPLETED] } // op is live
      }
      const ops = await Opportunity.find(query, 'name, status')
      console.log('Opportunity:', ops)
      console.log('returning:', ops.length > 0)
      // should we check published status here?
      return ops.length > 0
    } catch (e) { // whatever the reason for exception the test will fail
      console.error('activityStarted:', e)
      return false
    }
  }
}

/* get a single PersonalGoal record with org and person populated out */
const getPersonalGoalbyId = id =>
  PersonalGoal.findOne({ _id: id })
    .populate({ path: 'person', select: 'nickname' })
    .populate({ path: 'goal' })
    .exec()

// creates a new PersonalGoal or updates status of existing PersonalGoal
const addPersonalGoal = async (personalGoal) => {
  const found = await PersonalGoal.findOneAndUpdate(
    { // check for a match
      person: personalGoal.person,
      goal: personalGoal.goal
    },
    personalGoal, // create or upsert
    { new: true, upsert: true }
  )
  // get populated out PersonalGoal record
  return getPersonalGoalbyId(found._id)
}

// creates a new PersonalGoal or updates status of existing PersonalGoal
const addPersonalGoalGroup = async (category, personId) => {
  const q = { category }
  const goalSet = await Goal.find(q).select('name').exec()
  await Promise.all(goalSet.map(async goal => {
    const newPersonalGoal = new PersonalGoal({
      person: personId,
      goal: goal._id
    })
    return newPersonalGoal.save()
  }))
}

// true when the momentDate entered is days older than present
function isDaysAgo (momentDate, days) {
  const daysAgo = moment().subtract(days, 'days').startOf('day')
  return daysAgo.isAfter(momentDate)
}
const evaluatePersonalGoals = async (person) => {
  const pgs = await PersonalGoal
    .find({ person })
    .populate({ path: 'goal' })
    .exec()
  // for each goal see it its status has changed
  await Promise.all(pgs.map(async pg => {
    // unhide items after a delay
    if (pg.status === PersonalGoalStatus.HIDDEN &&
       isDaysAgo(moment(pg.dateHidden), 7)) {
      pg.status = PersonalGoalStatus.QUEUED
      delete pg.dateHidden
      return Promise.resolve(pg.save())
    }
    // dump the evaluation
    if (pg.goal.evaluation) {
      try {
        /* eslint-disable no-eval */
        const ev = eval(pg.goal.evaluation)
        const isCompleted = await ev(pg)
        if (isCompleted) {
          pg.status = PersonalGoalStatus.COMPLETED
          return Promise.resolve(pg.save())
        }
      } catch (e) {
        return Promise.reject(e)
      }
    }
  }))
}

module.exports = {
  getPersonalGoalbyId,
  addPersonalGoal,
  addPersonalGoalGroup,
  evaluatePersonalGoals,
  GoalTests
}
