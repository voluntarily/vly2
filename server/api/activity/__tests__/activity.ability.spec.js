import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Activity from '../activity'
import MemoryMongo from '../../../util/test-memory-mongo'
import acts from './activity.fixture.js'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import Organisation from '../../organisation/organisation'
import orgs from '../../organisation/__tests__/organisation.fixture'
import tagList from '../../tag/__tests__/tag.fixture'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add two activity entries', async (t) => {
  // connect each activity to an owner and org
  [t.context.people, t.context.orgs] = await Promise.all([
    Person.create(people),
    Organisation.create(orgs)
  ])

  acts.map((act, index) => {
    act.owner = t.context.people[index]._id
    act.offerOrg = t.context.orgs[index]._id
    // each act has two consecutive tags from the list
    act.tags = [tagList[index], tagList[index + 1]]
  })

  t.context.activities = await Activity.create(acts)
})

test.afterEach.always(async () => {
  await Promise.all([
    Activity.deleteMany(),
    Organisation.deleteMany(),
    Person.deleteMany()
  ])
})

test.serial('Activity API - anon - list', async t => {
  const response = await request(server)
    .get('/api/activities')
    .set('Accept', 'application/json')

  const actualActivities = response.body
  const expectedActivities = t.context.activities.filter(activity => activity.status === 'active')

  t.is(response.statusCode, 200)
  t.is(actualActivities.length, expectedActivities.length)
})

test.serial('Activity API - anon - create', async t => {
  const response = await request(server)
    .post('/api/activities')
    .send({
      name: 'Test activity name',
      subtitle: 'Subtitle',
      description: 'Description',
      duration: 'Duration',
      status: 'active',
      offerOrg: t.context.orgs[0]._id,
      owner: t.context.people[0]._id
    })

  t.is(response.statusCode, 403)
})

test.serial('Activity API - anon - view - active', async t => {
  const activeActivity = t.context.activities
    .filter(activity => activity.status === 'active')
    .pop()

  const response = await request(server)
    .get(`/api/activities/${activeActivity._id}`)
    .set('Accept', 'application/json')

  t.is(response.statusCode, 200)
})

test.serial('Activity API - anon - view - draft', async t => {
  const draftActivity = t.context.activities
    .filter(activity => activity.status === 'draft')
    .pop()

  const response = await request(server)
    .get(`/api/activities/${draftActivity._id}`)
    .set('Accept', 'application/json')

  t.is(response.statusCode, 404)
})

test.serial('Activity API - anon - update', async t => {
  const activity = t.context.activities[0]

  const response = await request(server)
    .put(`/api/activities/${activity._id}`)
    .send({
      name: `Updated ${activity.name}`
    })

  t.is(response.statusCode, 403)
})

test.serial('Activity API - anon - delete', async t => {
  const activity = t.context.activities[0]

  const response = await request(server)
    .delete(`/api/activities/${activity._id}`)

  t.is(response.statusCode, 403)
})
