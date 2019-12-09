const PersonalGoal = require('./personalGoal')
const Goal = require('../goal/goal')
const moment = require('moment')
const { PersonalGoalStatus } = require('./personalGoal.constants')
const { GoalTests } = require('./GoalTests')
/* Note These library functions call the database.
They can fail and throw exceptions, we don't catch them here but
allow them to be caught at the API layer where we can return a 4xx result
*/

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
  }))
}

module.exports = {
  getPersonalGoalbyId,
  addPersonalGoal,
  addPersonalGoalGroup,
  evaluatePersonalGoals,
  GoalTests
}
