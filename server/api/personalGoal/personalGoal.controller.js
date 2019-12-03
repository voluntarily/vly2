const PersonalGoal = require('./personalGoal')
const { getPersonalGoalbyId } = require('./personalGoal.lib')

/**
  api/PersonalGoals -> list all the goals assigned to me and get the goal details
 */
const listPersonalGoals = async (req, res) => {
  // Return enough info for a goalCard
  const got = await PersonalGoal.find({ person: req.query.meid })
    .populate({ path: 'goal' })
    .populate({ path: 'person', select: 'nickname name imgUrl' })
    .sort('sort').exec()
  res.json(got)
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
  createPersonalGoal
}
