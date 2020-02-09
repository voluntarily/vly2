import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Story from '../story'
import MemoryMongo from '../../../util/test-memory-mongo'
import stories from './story.fixture.js'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'

test.before('before connecting to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.serial('verify fixture database has stories', async t => {
  const count = await Story.countDocuments()
  t.is(count, t.context.stories.length)
  // Find all stories
  const p = await Story.find()
  t.is(t.context.stories.length, p.length)
  // Find stories by things
  const q = await Story.findOne({ name: 'Voluntarily wins Open Source Web prize' })
  t.is(q && q.status, 'published')
})

test.beforeEach('connect and add story entries', async (t) => {
  // save people
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  // assign person as author
  stories.map((story, index) => {
    story.author = t.context.people[index]._id
  })
  t.context.stories = await Story.create(stories).catch((err) => console.error('Unable to create stories', err))
})

test.afterEach.always(async () => {
  await Story.deleteMany()
})

test.serial('Should correctly give story 1 when searching by "wins"', async t => {
  const res = await request(server)
    .get('/api/stories?search=wins')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(stories[0].name, got[0].name)
  t.is(2, got.length)
})

test.serial('Should correctly give count of all stories sorted by name', async t => {
  const res = await request(server)
    .get('/api/stories')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(2, got.length)
  t.is(got[0].name, 'Voluntarily wins Open Source Web prize')
})
