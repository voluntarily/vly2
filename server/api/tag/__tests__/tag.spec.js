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
  t.context.tags = await Tag.create(tags).catch((err) => console.error('Unable to create tags', err))
})

test.afterEach.always(async () => {
  await Tag.deleteMany()
})

test.serial('verify fixture database has tags', async t => {
  const count = await Tag.countDocuments()
  t.is(count, t.context.tags.length)
  // can find all
  const p = await Tag.find()
  t.is(t.context.tags.length, p.length)

  // can find by things
  const q = await Tag.findOne({ tag: 'robots' })
  t.is(q.tag, 'robots')
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

test.serial('Should send correct data when queried against an _id', async t => {
  t.plan(2)

  const tag1 = t.context.tags[1]
  const res = await request(server)
    .get(`/api/tags/${tag1._id}`)
    .set('Accept', 'application/json')
  t.is(res.status, 200)
  t.is(res.body.tag, tag1.tag)
})

test.serial('Should not find invalid _id', async t => {
  const res = await request(server)
    .get('/api/tags/123456781234567812345678')
    .set('Accept', 'application/json')
  t.is(res.status, 404)
})

test.serial('Should correctly add a tag', async t => {
  t.plan(2)

  const res = await request(server)
    .post('/api/tags')
    .send({
      tag: 'volunteering'
    })
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const savedTag = await Tag.findOne({ tag: 'volunteering' }).exec()
  t.is(savedTag.tag, 'volunteering')
})

test.serial('Should correctly add multiple tags', async t => {
  const res = await request(server)
    .post('/api/tags')
    .send([{
      tag: 'volunteering'
    }, {
      tag: 'orienteering'
    }])
    .set('Accept', 'application/json')

  t.is(res.status, 200)
  t.is(2, res.body.length)

  const savedTag = await Tag.findOne({ tag: 'volunteering' }).exec()
  t.is(savedTag.tag, 'volunteering')

  const savedTag2 = await Tag.findOne({ tag: 'orienteering' }).exec()
  t.is(savedTag2.tag, 'orienteering')
})

test.serial('Should not add a duplicate tag', async t => {
  await request(server)
    .post('/api/tags')
    .send({
      tag: tags[0].tag
    })
    .set('Accept', 'application/json')

  const savedTag = await Tag.findOne({ tag: 'volunteering' }).exec()
  t.is(null, savedTag)
})

test.serial('Should not add a duplicate tag with different case', async t => {
  await request(server)
    .post('/api/tags')
    .send({
      tag: tags[0].tag.toUpperCase()
    })
    .set('Accept', 'application/json')

  const savedTag = await Tag.findOne({ tag: 'volunteering' }).exec()
  t.is(null, savedTag)
})

test.serial('Should correctly delete a tag', async t => {
  t.plan(2)

  const tag = new Tag({
    tag: 'computing'
  })
  await tag.save()

  const res = await request(server)
    .delete(`/api/tags/${tag._id}`)
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const queriedTag = await Tag.findOne({ _id: tag._id }).exec()
  t.is(queriedTag, null)
})
