import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Tag from '../tag'
import MemoryMongo from '../../../util/test-memory-mongo'
import tags from './tag.fixture.js'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add tag entries', async (t) => {
  t.context.tags = await Tag.create({ tags: tags }).catch((err) => console.error('Unable to create tags', err))
})

test.afterEach.always(async () => {
  await Tag.deleteMany()
})

test.serial('verify fixture database has tags', async t => {
  const p = await Tag.find()
  t.is(1, p.length)
  t.truthy(p[0].tags.includes('robots'))
})

test.serial('Should correctly give count of all tags', async t => {
  const res = await request(server)
    .get('/api/tags')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(tags.length, got.length)
})
