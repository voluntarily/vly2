import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Opportunity from '../../opportunity/opportunity'
import MemoryMongo from '../../../util/test-memory-mongo'
import ops from './search.fixture.js'
let memMongo
// enzyme library?

// start dummy database
test.before('before connect to database', async () => {
  await appReady
  memMongo = new MemoryMongo()
  await memMongo.start()
})

// close down dummy database
test.after.always(async () => {
  await memMongo.stop()
})

// waiting in case of an error in opportunity creation
test.beforeEach('connect and add two oppo entries', async () => {
  await Opportunity.create(ops).catch((err) => console.log('Unable to create opportunities', err))
})

test.afterEach.always(async () => {
  await Opportunity.deleteMany()
})

// Searching by something in the title (case insensitive)
test.serial('Should correctly give opportunity 1 when searching by "Mentor"', async t => {
  const res = await request(server)
    .get('/api/search?q=Mentor')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(ops[0].title, got[0].title)
  t.is(1, got.length)
})

// Searching for something in the description (case insensitive)
test.serial('Should correctly give opportunity 2 when searching by "Algorithms"', async t => {
  const res = await request(server)
    .get('/api/search?q=Algorithms')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(ops[1].description, got[0].description)
  t.is(1, got.length)
})

test.serial('Should exclude draft opportunities when searching by location "Auckland"', async t => {
  const res = await request(server)
    .get('/api/search?q=Auckland')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(ops[0].location, got[0].location)
  t.is(2, got.length)
})
