import test from 'ava'
import PersonalGoal from '../personalGoal'
import { PersonalGoalStatus } from '../personalGoal.constants'
import {
  getPersonalGoalbyId,
  addPersonalGoal,
  addPersonalGoalGroup
} from '../personalGoal.lib'
import Goal from '../../goal/goal'
import goals from '../../goal/__tests__/goal.fixture'
import Person from '../../person/person'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from '../../person/__tests__/person.fixture'

test.before('before connect to database', async (t) => {
  try {
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
  } catch (e) {
    console.error('personalGoal.spec.js - error in test setup', e)
  }

  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.goals = await Goal.create(goals).catch((err) => `Unable to create goals: ${err}`)
  t.context.goal = t.context.goals[0]
  t.context.andrew = t.context.people[0]
  t.context.dali = t.context.people[1]
  t.context.alice = t.context.people[2]
})

test.after.always(async (t) => {
  // await Person.deleteMany()
  await t.context.memMongo.stop()
})

test.serial('Should add a personalGoal when they are not there already', async t => {
  const personalGoalQuery = {
    person: t.context.alice._id,
    goal: t.context.goal._id
  }
  // show alice is not currently a personalGoal
  let personalGoal = await PersonalGoal.findOne(personalGoalQuery).exec()
  t.falsy(personalGoal)

  const personalGoalAlice = {
    person: t.context.alice._id,
    goal: t.context.goal._id
  }

  let newPersonalGoal = await addPersonalGoal(personalGoalAlice)
  t.truthy(newPersonalGoal)
  t.is(newPersonalGoal.person.nickname, t.context.alice.nickname)
  // and the personalGoals record will exist
  personalGoal = await PersonalGoal.findOne(personalGoalQuery).exec()
  t.truthy(personalGoal)
  t.is(personalGoal.status, PersonalGoalStatus.QUEUED)

  // test getter is populated
  const alice2 = await getPersonalGoalbyId(personalGoal._id)
  t.is(alice2.person.nickname, t.context.alice.nickname)
  t.is(alice2.goal.name, t.context.goal.name)

  // now update to be a ACTIVE
  personalGoal.status = PersonalGoalStatus.ACTIVE
  newPersonalGoal = await addPersonalGoal(personalGoal)
  t.truthy(newPersonalGoal)
  t.is(newPersonalGoal.person.nickname, t.context.alice.nickname)
  // and the personalGoals record will exist
  personalGoal = await PersonalGoal.findOne(personalGoalQuery).exec()
  t.truthy(personalGoal)
  t.is(personalGoal.status, PersonalGoalStatus.ACTIVE)
})

test.serial('Should add a personalGoal Group to the person', async t => {
  const q = { person: t.context.dali._id }
  // Dali has no goals
  let dalisGoals = await PersonalGoal.find(q).exec()
  t.is(dalisGoals.length, 0)

  // try with an invalid category
  await addPersonalGoalGroup('This should fail', t.context.dali._id)
  dalisGoals = await PersonalGoal.find(q).exec()
  t.is(dalisGoals.length, 0)

  await addPersonalGoalGroup('Getting Started', t.context.dali._id)
  // Dali now has 2 goals
  dalisGoals = await PersonalGoal.find(q).exec()
  t.is(dalisGoals.length, 2)
})
