import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Story from '../story'
import MemoryMongo from '../../../util/test-memory-mongo'
import stories from './story.fixture.js'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'

test.before('before connecting to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add story entries', async (t) => {
  // save people
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  // assign person as author
  stories.map((story, index) => {
    story.author = t.context.people[index]._id
  })
  // t.context.stories = await Story.create({ stories: stories }).catch((err) => console.error('Unable to create stories', err))
  t.context.stories = await Story.create(stories).catch((err) => console.error('Unable to create stories', err))
})

test.afterEach.always(async () => {
  await Story.deleteMany()
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

test.serial('Should correctly give count of all stories sorted by name', async t => {
  const res = await request(server)
    .get('/api/stories')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(t.context.stories.length, got.length)
  t.is(got[0].name, stories[0].name)
})
