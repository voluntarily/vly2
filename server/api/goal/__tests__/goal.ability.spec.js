import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Goal from '../goal'
import goals from './goal.fixture'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import MemoryMongo from '../../../util/test-memory-mongo'
import { jwtData, jwtDataAlice, jwtDataDali } from '../../../middleware/session/__tests__/setSession.fixture'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('populate fixtures', async (t) => {
  [t.context.goals, t.context.people] = await Promise.all([
    Goal.create(goals),
    Person.create(people)
  ])
})

test.afterEach.always(async () => {
  await Promise.all([
    Goal.deleteMany(),
    Person.deleteMany()
  ])
})

const testScenarios = [
  {
    role: 'anon',
    cookie: null
  },
  {
    role: 'activity provider',
    cookie: `idToken=${jwtDataDali.idToken}`
  },
  {
    role: 'opportunity provider',
    cookie: `idToken=${jwtDataAlice.idToken}`
  },
  {
    role: 'admin',
    cookie: `idToken=${jwtData.idToken}`
  }
]

for (const testData of testScenarios) {
  test.serial(`Goal API - ${testData.role} - list`, async t => {
    const response = await request(server)
      .get('/api/goals')
      .set('Accept', 'application/json')
      .set('Cookie', [testData.cookie])

    const actualGoals = response.body
    const expectedGoals = t.context.goals

    t.is(response.statusCode, 200)
    t.is(actualGoals.length, expectedGoals.length)
  })

  test.serial(`Goal API - ${testData.role} - read`, async t => {
    const goalToRead = t.context.goals[0]

    const response = await request(server)
      .get(`/api/goals/${goalToRead._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [testData.cookie])

    t.is(response.statusCode, 200)
  })

  test.serial(`Goal API - ${testData.role} - create`, async t => {
    const response = await request(server)
      .post('/api/goals')
      .set('Accept', 'application/json')
      .set('Cookie', [testData.cookie])
      .send({
        group: 'test-group',
        name: 'Test name',
        slug: 'test-slug',
        subtitle: 'Subtitle',
        description: 'Description',
        startLink: '/home',
        rank: 1,
        evaluation: 'async (personalGoal) => { return false }'
      })
    const expected = testData.role === 'admin' ? 200 : 403
    t.is(response.statusCode, expected)
  })

  test.serial(`Goal API - ${testData.role} - update`, async t => {
    const goalToUpdate = t.context.goals[0]

    const response = await request(server)
      .put(`/api/goals/${goalToUpdate._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [testData.cookie])
      .send({
        name: 'Updated test name'
      })

    const expected = testData.role === 'admin' ? 200 : 403
    t.is(response.statusCode, expected)
  })

  test.serial(`Goal API - ${testData.role} - delete`, async t => {
    const goalToDelete = t.context.goals[0]

    const response = await request(server)
      .delete(`/api/goals/${goalToDelete._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [testData.cookie])

    const expected = testData.role === 'admin' ? 200 : 403
    t.is(response.statusCode, expected)
  })
}
