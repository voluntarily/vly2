import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Tag from '../tag'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import tags from './tag.fixture.js'
import { jwtData, jwtDataDali } from '../../../middleware/session/__tests__/setSession.fixture'
import people from '../../person/__tests__/person.fixture'
import Person from '../../person/person'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  await appReady

  const tagCollection = [
    { tags: tags },
    { name: 'numbers', tags: ['one', 'two', 'three'] }
  ]
  t.context.people = await Person.create(people).catch((err) => console.error('Unable to create people', err))
  t.context.tags = await Tag.create(tagCollection).catch((err) => console.error('Unable to create tags', err))
})

test.after.always(async (t) => {
  await Tag.deleteMany()
  await t.context.memMongo.stop()
})

/* -- Anon person */
test('Tag API - anon - create', async t => {
  const response = await request(server)
    .post('/api/tags')
    .send({ name: 'test', tags: ['a', 'b', 'c'] })

  t.is(response.statusCode, 403)
})

test('Tag API - anon - read', async t => {
  const res = await request(server)
    .get('/api/tags')
    .set('Accept', 'application/json')
  t.is(res.status, 200)
})
test('Tag API - anon - update', async t => {
  const tag = t.context.tags[0]

  const response = await request(server)
    .put(`/api/tags/${tag._id}`)
    .send({ tags: ['a', 'b', 'c'] })

  t.is(response.statusCode, 403)
})

test('Tag API - anon - delete', async t => {
  const tag = t.context.tags[0]

  const response = await request(server)
    .delete(`/api/tags/${tag._id}`)

  t.is(response.statusCode, 403)
})

/* -- Signed in person */

test('Tag API - signed - create', async t => {
  const response = await request(server)
    .post('/api/tags')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .send({ tags: ['a', 'b', 'c'] })

  t.is(response.statusCode, 403)
})

test('Tag API - signed - read default list', async t => {
  const res = await request(server)
    .get('/api/tags')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)

  const got = res.body
  t.is(tags.length, got.length)
  t.is(got[0], tags[0])
})

test('Tag API - signed - read by name', async t => {
  const res = await request(server)
    .get('/api/tags?name=numbers')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)

  const got = res.body
  t.is(got.length, 3)
  t.is(got[0], 'one')
})

test('Tag API - signed - update', async t => {
  const tag = t.context.tags[0]

  const response = await request(server)
    .put(`/api/tags/${tag._id}`)
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .send({ tags: ['a', 'b', 'c'] })

  t.is(response.statusCode, 403)
})

test('Tag API - signed - delete', async t => {
  const tag = t.context.tags[0]

  const response = await request(server)
    .delete(`/api/tags/${tag._id}`)
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])

  t.is(response.statusCode, 403)
})

/* -- Admin person */

test('Tag API - admin - CRUD', async t => {
  let response = await request(server)
    .post('/api/tags')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({ name: 'crud', tags: ['a', 'b', 'c'] })

  t.is(response.statusCode, 200)
  const newtags = response.body
  const id = newtags._id

  // get by id - non admin check
  response = await request(server)
    .get(`/api/tags/${id}`)
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])

  t.is(response.statusCode, 200)
  t.is(response.body.tags.length, 3)

  // update
  response = await request(server)
    .put(`/api/tags/${id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({ name: 'crud', tags: ['a', 'b', 'c', 'd'] })
  t.is(response.statusCode, 200)

  response = await request(server)
    .delete(`/api/tags/${id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(response.statusCode, 200)
})
