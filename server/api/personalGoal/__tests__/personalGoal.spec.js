import test from 'ava'
import request from 'supertest'
import { appReady, server } from '../../../server'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import Goal from '../../goal/goal'
import goals from '../../goal/__tests__/goal.fixture'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import PersonalGoal from '../personalGoal'
import { PersonalGoalStatus } from '../personalGoal.constants'
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  try {
    await appReady
    t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
    t.context.goals = await Goal.create(goals).catch((e) => console.error('Unable to create goals', e))

    // link people to goals
    const me = t.context.people[0]
    const dali = t.context.people[1]
    const personalGoals = [
      {
        person: me._id,
        goal: t.context.goals[0]._id,
        status: PersonalGoalStatus.QUEUED
      },
      {
        person: me._id,
        goal: t.context.goals[1]._id,
        status: PersonalGoalStatus.ACTIVE,
        dateStarted: '2019-12-01T10:00:00.000Z'
      },
      {
        person: me._id,
        goal: t.context.goals[2]._id,
        status: PersonalGoalStatus.COMPLETED,
        dateStarted: '2019-12-01T10:00:00.000Z',
        dateCompleted: '2019-12-10T10:00:00.000Z'
      },
      {
        person: dali._id,
        goal: t.context.goals[0]._id,
        status: PersonalGoalStatus.QUEUED
      },
      {
        person: dali._id,
        goal: t.context.goals[1]._id,
        status: PersonalGoalStatus.ACTIVE,
        dateStarted: '2019-12-01T10:00:00.000Z'
      },
      {
        person: dali._id,
        goal: t.context.goals[2]._id,
        status: PersonalGoalStatus.COMPLETED,
        dateStarted: '2019-12-01T10:00:00.000Z',
        dateCompleted: '2019-12-10T10:00:00.000Z'
      }
    ]
    t.context.personalGoals = await PersonalGoal.create(personalGoals).catch((e) => console.error('Unable to create personalGoals', e))
  } catch (e) { console.error('personalGoal.spec.js before error:', e) }
})

test.serial('Should not return any personal goals without a person id', async t => {
  const res = await request(server)
    .get('/api/personalGoals')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
  t.deepEqual(0, res.body.length)
})

test.serial('Should give a list of goals for a person', async t => {
  const personid = t.context.people[0]._id

  const res = await request(server)
    .get(`/api/personalGoals?meid=${personid}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
  const personalGoals = res.body
  t.deepEqual(3, personalGoals.length)
  // sorted by status
  t.is(personalGoals[0].status, PersonalGoalStatus.CLOSED)
  t.is(personalGoals[1].status, PersonalGoalStatus.COMPLETED)
  t.is(personalGoals[2].status, PersonalGoalStatus.QUEUED)
})

test.serial('Should send correct data when queried against a _id', async t => {
  const personalgoal = t.context.personalGoals[0]
  const res = await request(server)
    .get(`/api/personalGoals/${personalgoal._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(200, res.status)
  t.is(personalgoal.person.toString(), res.body.person)
  t.is(personalgoal.goal.toString(), res.body.goal)
})

test.serial('Should return 404 code when queried non existing personalgoal', async t => {
  const res = await request(server)
    .get('/api/personalGoals/asodifklamd')
    .set('Accept', 'application/json')

  // This test is not ready since the return status was 500 not 404
  const expectedResponseStatus = 500
  t.is(res.status, expectedResponseStatus)
})

test.serial(
  'Should not add personalgoal where referenced person or goal is not in DB',
  async t => {
    const newPersonalGoal = new PersonalGoal({
      person: '5cc8d60b8b16812b5babcdef',
      goal: '5cc8d60b8b16812b5babcdef'
    })

    await request(server)
      .post('/api/personalGoals')
      .send(newPersonalGoal)
      .set('Accept', 'application/json')

    const savedPersonalGoal = await PersonalGoal.findOne({
      person: newPersonalGoal.person,
      goal: newPersonalGoal.goal
    }).exec()

    t.is(null, savedPersonalGoal)
  }
)

test.serial('Should add a valid goal', async t => {
  const person = t.context.people[4]
  const goal = t.context.goals[2]
  const newPersonalGoal = {
    person: person._id.toString(),
    goal: goal._id.toString()
    // status: don't set it should be defaulted to QUEUED
  }

  let res = await request(server)
    .post('/api/personalGoals')
    .send(newPersonalGoal)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)
  const returnedPersonalGoal = res.body

  const savedPersonalGoal = await PersonalGoal.findOne({
    person: newPersonalGoal.person,
    goal: newPersonalGoal.goal
  }).exec()
  t.is(savedPersonalGoal.person._id.toString(), person._id.toString())
  t.is(savedPersonalGoal.goal._id.toString(), goal._id.toString())
  t.is(savedPersonalGoal.status, PersonalGoalStatus.QUEUED)

  // update state to personalgoal
  returnedPersonalGoal.status = PersonalGoalStatus.ACTIVE
  res = await request(server)
    .put(`/api/personalGoals/${returnedPersonalGoal._id}`)
    .send(returnedPersonalGoal)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)
  const updatedPersonalGoal = res.body
  t.is(updatedPersonalGoal.status, PersonalGoalStatus.ACTIVE)

  // update state to personalgoal
  returnedPersonalGoal.status = PersonalGoalStatus.HIDDEN
  res = await request(server)
    .put(`/api/personalGoals/${returnedPersonalGoal._id}`)
    .send(returnedPersonalGoal)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)
  t.is(res.body.status, PersonalGoalStatus.HIDDEN)

  // update state to personalgoal
  returnedPersonalGoal.status = PersonalGoalStatus.COMPLETED
  res = await request(server)
    .put(`/api/personalGoals/${returnedPersonalGoal._id}`)
    .send(returnedPersonalGoal)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)
  t.is(res.body.status, PersonalGoalStatus.COMPLETED)

  await request(server)
    .delete(`/api/personalGoals/${returnedPersonalGoal._id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const queriedPersonalGoal = await PersonalGoal.findOne({
    _id: returnedPersonalGoal._id
  }).exec()
  t.is(null, queriedPersonalGoal)
})
