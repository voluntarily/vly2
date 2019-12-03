const PersonalGoal = require('./personalGoal')
const Goal = require('../goal/goal')
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
  console.log('addPersonalGoalGroup', category, personId)
  const q = { category }
  console.log(q)
  const goalSet = await Goal.find(q).select('name').exec()
  console.log('goalset ', goalSet)
  await Promise.all(goalSet.map(async goal => {
    const newPersonalGoal = new PersonalGoal({
      person: personId,
      goal: goal._id
    })
    return newPersonalGoal.save()
  }))
}

module.exports = {
  getPersonalGoalbyId,
  addPersonalGoal,
  addPersonalGoalGroup
}
