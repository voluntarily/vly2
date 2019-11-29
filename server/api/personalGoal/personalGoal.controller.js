const PersonalGoal = require('./personalGoal')

/* get a single PersonalGoal record with org and person populated out */
const getPersonalGoalbyId = id => {
  return PersonalGoal.findOne({ _id: id })
    .populate({ path: 'person', select: 'nickname' })
    .populate({ path: 'goal' })
    .exec()
}

/**
  api/PersonalGoals -> list all PersonalGoals
  api/PersonalGoals?meid='personid' -> list all the goals assigned to me and get the goal details
 */
const listPersonalGoals = async (req, res) => {
  const sort = 'status'
  let got
  // try {
  if (req.query.meid) {
    // a person is asking for a list of PersonalGoals
    const query = { person: req.query.meid }
    // Return enough info for a goalCard
    got = await PersonalGoal.find(query).populate({ path: 'goal' }).sort(sort).exec()
  } else {
    // list all relationships
    got = await PersonalGoal.find().sort(sort).exec()
  }
  res.json(got)
  // } catch (err) {
  //   res.status(404).send(err)
  // }
}

const updatePersonalGoal = async (req, res) => {
  // try {
  await PersonalGoal.updateOne({ _id: req.body._id }, { $set: { status: req.body.status } }).exec()
  // TODO: update the dates on goal state changes
  // TODO: notify the person of their status change in the Goal
  const got = await getPersonalGoalbyId(req.body._id)
  res.json(got)
  // } catch (err) {
  //   res.status(404).send(err)
  // }
}

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

const createPersonalGoal = async (req, res) => {
  const newPersonalGoal = new PersonalGoal(req.body)
  try {
    await newPersonalGoal.save()
    // TODO: [VP-424] email new PersonalGoals or followers of an Goal
    // return the PersonalGoal record with the org name filled in.
    const got = await getPersonalGoalbyId(newPersonalGoal._id)
    return res.json(got)
  } catch (e) {
    return res.status(400).send(e)
  }
}

module.exports = {
  listPersonalGoals,
  updatePersonalGoal,
  createPersonalGoal,
  addPersonalGoal
}
