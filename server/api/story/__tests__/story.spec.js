import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Story from '../story'
import MemoryMongo from '../../../util/test-memory-mongo'
import stories from './story.fixture.js'

test.before('before connecting to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add story entries', async (t) => {
  t.context.tags = await Story.create({ stories: stories }).catch((err) => console.error('Unable to create stories', err))
})

test.afterEach.always(async () => {
  await Story.deleteMany()
})

// test.serial('verify fixture database has stories', async t => {
//   const p = await Story.find()
//   t.is(1, p.length)
//   t.truthy(p[0].stories.includes({ status: 'published' }))
// })

test.only('verify fixture database has stories', async t => {
  const count = await Story.countDocuments()
  t.is(count, t.context.stories.length)
  // can find all
  const p = await Story.find()
  t.is(t.context.stories.length, p.length)

  // can find by things
  const q = await Story.findOne({ name: 'Voluntarily wins Open Source Web prize' })
  t.is(q && q.status, 'published')
  // t.is(q.slug, '4-the-first-100-metres')
})

test.serial('Should correctly give count of all stories', async t => {
  const res = await request(server)
    .get('/api/stories')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(stories.length, got.length)
})
