import PersonalGoal, { find, accessibleBy } from './personalGoal'
import { getPersonalGoalbyId, evaluatePersonalGoals } from './personalGoal.lib'
import { PersonalGoalStatus } from './personalGoal.constants'
import { Action } from '../../services/abilities/ability.constants'

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
  const got = await find({ person: me })
    .accessibleBy(req.ability, Action.LIST)
    .populate({ path: 'goal' })
    .populate({ path: 'person', select: 'nickname name imgUrl' })
    .sort('status').exec()

  res.json(got)
}

const updatePersonalGoal = async (req, res) => {
  const pg = req.body
  const id = req.params._id
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
    await accessibleBy(req.ability, Action.UPDATE)
      .updateOne({ _id: id }, { $set: set }).exec()
    const got = await getPersonalGoalbyId(id)
    res.json(got)
  } catch (e) {
    console.error(e)
    return res.sendStatus(400) // 400 error for any bad request body. This also prevent error to propagate and crash server
  }
  // TODO: update the dates on goal state changes
  // TODO: notify the person of their status change in the Goal
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

export default {
  listPersonalGoals,
  updatePersonalGoal,
  createPersonalGoal
}
