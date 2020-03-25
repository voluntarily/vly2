const PersonalGoal = require('./personalGoal')
const Goal = require('../goal/goal')
const moment = require('moment')
const { PersonalGoalStatus } = require('./personalGoal.constants')
const { GoalTests } = require('./GoalTests')
const PubSub = require('pubsub-js')
const { TOPIC_GOALGROUP__ADD } = require('../../services/pubsub/topic.constants')
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
const addPersonalGoalGroup = async (group, personId) => {
  const goalSet = await Goal.find({ group }).select('name').exec()
  if (!goalSet.length) return

  const pgs = goalSet.map(goal => {
    return {
      person: personId,
      goal: goal._id
    }
  })
  const personalGoalGroup = await PersonalGoal.create(pgs)
    .catch((err) => console.error('Unable to create personalGoals:', err))
  PubSub.publish(TOPIC_GOALGROUP__ADD, personalGoalGroup)

  return personalGoalGroup
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
    switch (pg.status) {
      case PersonalGoalStatus.QUEUED: // goal has been issued but not started. initial state
      case PersonalGoalStatus.ACTIVE: // goal has been started but not finished - in progress
        try {
          /* eslint-disable no-eval */
          if (pg.goal.evaluation) {
            const ev = eval(pg.goal.evaluation)
            const isCompleted = await ev(pg)
            if (isCompleted) {
              pg.dateCompleted = Date.now()
              pg.status = PersonalGoalStatus.COMPLETED
              return Promise.resolve(pg.save())
            }
          }
        } catch (e) {
          console.error('PersonalGoal eval failed:', e)
          return Promise.reject(e)
        }
        break
      case PersonalGoalStatus.COMPLETED: // goal has been completed - met its evaluation test
        // close items after a week of being completed
        if (isDaysAgo(moment(pg.dateCompleted), 7)) {
          pg.status = PersonalGoalStatus.CLOSED
          return Promise.resolve(pg.save())
        }
        break
      case PersonalGoalStatus.HIDDEN: // goal has been hidden (but not deleted)
        // unhide items after a delay
        if (isDaysAgo(moment(pg.dateHidden), 7)) {
          pg.status = PersonalGoalStatus.QUEUED
          delete pg.dateHidden
          return Promise.resolve(pg.save())
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
