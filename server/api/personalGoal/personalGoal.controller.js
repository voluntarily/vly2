const PersonalGoal = require('./personalGoal')
const { getPersonalGoalbyId, evaluatePersonalGoals } = require('./personalGoal.lib')
const { PersonalGoalStatus } = require('./personalGoal.constants')
const Action = require('../../services/abilities/ability.constants')

/**
  api/PersonalGoals -> list all the goals assigned to me and get the goal details
 */
const listPersonalGoals = async (req, res) => {
  const me = req.query.meid
  try {
    await evaluatePersonalGoals(me, req)
  } catch (err) {
    res.status(500)
  }
  // Return enough info for a goalCard
  const got = await PersonalGoal.find({ person: me })
    .populate({ path: 'goal' })
    .populate({ path: 'person', select: 'nickname name imgUrl' })
    .sort('status').exec()

  res.json(got)
}

const updatePersonalGoal = async (req, res) => {
  const { ability: userAbility, body: pg } = req
  console.log('updatePersonalGoal', userAbility, pg)
  const status = pg.status
  const set = { status }
  switch (status) {
    case PersonalGoalStatus.ACTIVE:
      set.dateStarted = Date.now()
      break
    case PersonalGoalStatus.HIDDEN:
      set.dateHidden = Date.now()
      break
    case PersonalGoalStatus.COMPLETED:
      set.dateCompleted = Date.now()
      break
  }
  try {
    await PersonalGoal
      .accessibleBy(userAbility, Action.UPDATE)
      .updateOne({ _id: pg._id }, { $set: set }).exec()
  } catch (e) {
    console.log(e)
    return res.sendStatus(400) // 400 error for any bad request body. This also prevent error to propagate and crash server
  }
  // TODO: update the dates on goal state changes
  // TODO: notify the person of their status change in the Goal
  const got = await getPersonalGoalbyId(req.body._id)
  res.json(got)
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
