import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Opportunity from '../opportunity'
import MemoryMongo from '../../../util/test-memory-mongo'
import ops from './opportunity.fixture.js'
let memMongo

test.before('before connect to database', async () => {
  await appReady
  memMongo = new MemoryMongo()
  await memMongo.start()
})

test.after.always(async () => {
  await memMongo.stop()
})

test.beforeEach('connect and add two oppo entries', async () => {
  await Opportunity.create(ops).catch((err) => console.log('Unable to create opportunities', err))
})

test.afterEach.always(async () => {
  await Opportunity.deleteMany()
})

test.serial('verify fixture database has ops', async t => {
  const count = await Opportunity.countDocuments()
  t.is(count, ops.length)
  // can find all
  const p = await Opportunity.find()
  t.is(ops.length, p.length)

  // can find by things
  const q = await Opportunity.findOne({ title: '4 The first 100 metres' })
  t.is(q && q.duration, '2 hours')
})

test.serial('Should correctly give count of all Ops sorted by title', async t => {
  const res = await request(server)
    .get('/api/opportunities')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  // console.log(got)
  t.is(4, got.length)

  t.is(got[0].title, '1 Mentor a year 12 business Impact Project')
})

test.serial('Should correctly give subset of ops matching status', async t => {
  const res = await request(server)
    .get('/api/opportunities?q={"status":"draft"}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  // console.log('got', got)
  t.is(got.length, 2)
})

test.serial('Should correctly select just the names and ids', async t => {
  const res = await request(server)
    .get('/api/opportunities?p={"title": 1}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  // console.log('got', got)
  t.is(got.length, 4)
  t.is(got[0].status, undefined)
  t.is(got[0].title, '1 Mentor a year 12 business Impact Project')
})

test.serial('Should correctly give number of active Opportunities', async t => {
  const res = await request(server)
    .get('/api/opportunities?q={"status": "active"}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    // .expect('Content-Length', '2')
  const got = res.body

  t.deepEqual(2, got.length)
})

test.serial('Should send correct data when queried against a _id', async t => {
  t.plan(2)

  const oppo = new Opportunity(
    {
      _id: '5cc8d60b8b16812b5b3920c3',
      title: 'The first 200 metres',
      subtitle: 'Launching into space step 2',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 200m',
      duration: '2 hours',
      location: 'Albany, Auckland',
      status: 'draft'
    }
  )
  oppo.save()

  const res = await request(server)
    .get('/api/opportunities/5cc8d60b8b16812b5b3920c3')
    .set('Accept', 'application/json')
  t.is(res.status, 200)
  t.is(res.body.title, oppo.title)
})

test.serial('Should correctly add an opportunity', async t => {
  t.plan(2)

  const res = await request(server)
    .post('/api/opportunities')
    .send({
      title: 'The first 400 metres',
      subtitle: 'Launching into space step 3',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours',
      location: 'Albany, Auckland',
      status: 'draft'
    })
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const savedOpportunity = await Opportunity.findOne({ title: 'The first 400 metres' }).exec()
  t.is(savedOpportunity.subtitle, 'Launching into space step 3')
})

test.serial('Should correctly delete an opportunity', async t => {
  t.plan(2)

  const opp = new Opportunity({
    _id: '5cc8d60b8b16812b5b3920c3',
    title: 'The first 1000 metres',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: 'draft'
  })
  opp.save()

  const res = await request(server)
    .delete(`/api/opportunities/${opp._id}`)
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const queriedOpportunity = await Opportunity.findOne({ _id: opp._id }).exec()
  t.is(queriedOpportunity, null)
})

// Searching by something in the title (case insensitive)
test.serial('Should correctly give opportunity 1 when searching by "Mentor"', async t => {
  const res = await request(server)
    .get('/api/opportunities?search=MeNTor')
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
    .get('/api/opportunities?search=AlgorithMs')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(ops[1].description, got[0].description)
  t.is(1, got.length)
})
