import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import PersonalGoal from '../personalGoal'
import { startMongo, stopMongo } from '../../../util/mockMongo'

import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import Goal from '../../goal/goal'
import goals from '../../goal/__tests__/goal.fixture'
import { PersonalGoalStatus } from '../personalGoal.constants'

import { jwtData, jwtDataDali } from '../../../middleware/session/__tests__/setSession.fixture'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  await appReady
})

test.before('connect and add two personalgoal entries', async (t) => {
  // connect each personalgoal to an owner and org
  [t.context.people, t.context.goals] = await Promise.all([
    Person.create(people),
    Goal.create(goals)
  ])
  // link people to goals
  const admin = t.context.people[0]
  const dali = t.context.people[1]
  const alice = t.context.people[2]
  const personalGoals = [
    {
      person: admin._id,
      goal: t.context.goals[0]._id,
      status: PersonalGoalStatus.QUEUED
    },
    {
      person: dali._id,
      goal: t.context.goals[1]._id,
      status: PersonalGoalStatus.QUEUED
    },
    {
      person: alice._id,
      goal: t.context.goals[2]._id,
      status: PersonalGoalStatus.ACTIVE
    }
  ]
  t.context.personalGoals = await PersonalGoal.create(personalGoals)
})

// test.after.always(async () => {
//   await Promise.all([
//     PersonalGoal.deleteMany(),
//     Person.deleteMany(),
//     Goal.deleteMany()
//   ])
// })

// ANON
test('PersonalGoal API - anon - cannot read', async t => {
  let response = await request(server)
    .get('/api/personalGoals')
    .set('Accept', 'application/json')
  t.is(response.statusCode, 403)

  const id = t.context.personalGoals[1]._id
  response = await request(server)
    .get(`/api/personalGoals/${id}`)
    .set('Accept', 'application/json')

  t.is(response.statusCode, 403)
})

test('PersonalGoal API - anon - cannot write', async t => {
  // POST
  let response = await request(server)
    .post('/api/personalGoals')
    .send({
      person: t.context.people[3]._id,
      goal: t.context.goals[1]._id
    })

  t.is(response.statusCode, 403)
  // PUT
  const id = t.context.personalGoals[1]._id
  response = await request(server)
    .put(`/api/personalGoals/${id}`)
    .send({
      status: PersonalGoalStatus.ACTIVE
    })

  t.is(response.statusCode, 403)

  // DELETE
  response = await request(server)
    .delete(`/api/personalGoals/${id}`)

  t.is(response.statusCode, 403)
})
// NORMAL - signed in person
test('PersonalGoal API - normal - list self', async t => {
  const id = t.context.people[1]._id
  const response = await request(server)
    .get(`/api/personalGoals?meid=${id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])

  const actualPersonalGoals = response.body

  t.is(response.statusCode, 200)
  t.is(actualPersonalGoals.length, 1, `actualPersonalGoals =${actualPersonalGoals.toString()}`)
  t.is(actualPersonalGoals[0].person._id, id.toString())
})

test('PersonalGoal API - normal - cannot list other peoples goals', async t => {
  // an attempt to list someone else's goals returns OK and an empty array.
  const id = t.context.people[0]._id
  const response = await request(server)
    .get(`/api/personalGoals?meid=${id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
  t.is(response.statusCode, 200)
  t.is(response.body.length, 0)
})

test('PersonalGoal API - normal - cannot create a new personalGoal directly', async t => {
  // cannot create new personalGoals
  const response = await request(server)
    .post('/api/personalGoals')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .send({
      person: t.context.people[1]._id,
      goal: t.context.goals[3]._id
    })
  t.is(response.statusCode, 403)
})

test.serial('PersonalGoal API - normal - can update status', async t => {
  // can update status
  const id = t.context.personalGoals[1]._id
  const response = await request(server)
    .put(`/api/personalGoals/${id}`)
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .send({
      status: PersonalGoalStatus.ACTIVE
    })
  const pg = response.body
  t.is(response.statusCode, 200)
  t.is(pg.status, PersonalGoalStatus.ACTIVE)
})

test('PersonalGoal API - normal - cannot update some one elses status', async t => {
  // can update status, OK is returned but no changes made.
  const id = t.context.personalGoals[2]._id
  const response = await request(server)
    .put(`/api/personalGoals/${id}`)
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .send({
      status: PersonalGoalStatus.COMPLETED
    })
  t.is(response.statusCode, 200)
  t.is(response.body.status, t.context.personalGoals[2].status) // unchanged
})

test.serial('PersonalGoal API - normal - cannot update anything but status ', async t => {
  // cannot update other fields
  const id = t.context.personalGoals[1]._id

  const response = await request(server)
    .put(`/api/personalGoals/${id}`)
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .send({
      dateCompleted: '2000-01-01T00:00:00.0000Z'
    })
  const pg = response.body

  t.is(response.statusCode, 200)
  t.not(pg.dateCompleted, '2000-01-01T00:00:00.0000Z')
})

test.serial('PersonalGoal API - normal - cannot delete', async t => {
  const id = t.context.personalGoals[1]._id

  const response = await request(server)
    .delete(`/api/personalGoals/${id}`)

  t.is(response.statusCode, 403)
})

// ADMIN
test('PersonalGoal API - admin - list self', async t => {
  const id = t.context.people[0]._id
  const response = await request(server)
    .get(`/api/personalGoals?meid=${id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  const actualPersonalGoals = response.body

  t.is(response.statusCode, 200)
  t.is(actualPersonalGoals.length, 1, `actualPersonalGoals =${actualPersonalGoals.toString()}`)
  t.is(actualPersonalGoals[0].person._id, id.toString())
})

test('PersonalGoal API - admin - list other', async t => {
  const id = t.context.people[1]._id
  const response = await request(server)
    .get(`/api/personalGoals?meid=${id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  const actualPersonalGoals = response.body

  t.is(response.statusCode, 200)
  t.is(actualPersonalGoals.length, 1, `actualPersonalGoals =${actualPersonalGoals.toString()}`)
  t.is(actualPersonalGoals[0].person._id, id.toString())
})

test.serial('PersonalGoal API - admin - can write', async t => {
  let response = await request(server)
    .post('/api/personalGoals')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({
      person: t.context.people[3]._id,
      goal: t.context.goals[1]._id
    })

  t.is(response.statusCode, 200)
  let pg = response.body
  t.is(pg.status, PersonalGoalStatus.QUEUED)

  const id = pg._id
  response = await request(server)
    .get(`/api/personalGoals/${id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  pg = response.body
  t.is(response.statusCode, 200)
  t.is(pg.person, t.context.people[3]._id.toString())

  // check can change status
  response = await request(server)
    .put(`/api/personalGoals/${id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({
      status: PersonalGoalStatus.ACTIVE
    })
  pg = response.body
  t.is(response.statusCode, 200)
  t.is(pg.status, PersonalGoalStatus.ACTIVE)

  // admin cannot change other fields
  response = await request(server)
    .put(`/api/personalGoals/${id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({
      status: PersonalGoalStatus.COMPLETED,
      dateCompleted: '2000-01-01T00:00:00.0000Z'
    })
  pg = response.body
  t.is(response.statusCode, 200)
  t.is(pg.status, PersonalGoalStatus.COMPLETED)
  t.not(pg.dateCompleted, '2000-01-01T00:00:00.0000Z')

  response = await request(server)
    .delete(`/api/personalGoals/${id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(response.statusCode, 200)
})
