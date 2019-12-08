const PersonalGoal = require('./personalGoal')
const { getPersonalGoalbyId, evaluatePersonalGoals } = require('./personalGoal.lib')
const { PersonalGoalStatus } = require('./personalGoal.constants')

/**
  api/PersonalGoals -> list all the goals assigned to me and get the goal details
 */
const listPersonalGoals = async (req, res) => {
  // if (!req.session || !req.session.isAuthenticated) { return res.status(403).end() }

  const me = req.query.meid
  await evaluatePersonalGoals(me, req)
  // Return enough info for a goalCard
  const got = await PersonalGoal.find({ person: me })
    .populate({ path: 'goal' })
    .populate({ path: 'person', select: 'nickname name imgUrl' })
    .sort('status').exec()

  res.json(got)
}

const updatePersonalGoal = async (req, res) => {
  const status = req.body.status
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
  await PersonalGoal.updateOne({ _id: req.body._id }, { $set: set }).exec()
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
