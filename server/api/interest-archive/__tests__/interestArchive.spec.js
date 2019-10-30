import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import InterestArchive from '../interestArchive'
import ArchivedOpportunity from '../../archivedOpportunity/archivedOpportunity'
import Person from '../../person/person'
import MemoryMongo from '../../../util/test-memory-mongo'
import interests from './interestArchive.fixture'
import people from '../../person/__tests__/person.fixture'
import archivedOps from '../../archivedOpportunity/__tests__/archivedOpportunity.fixture.js'

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and set up test fixture', async (t) => {
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  archivedOps.map((op, index) => { op.requestor = t.context.people[0]._id })
  t.context.opportunities = await ArchivedOpportunity.create(archivedOps).catch((err) => console.error('Unable to create opportunities', err))
  interests.map((interest, index) => {
    interest.opportunity = t.context.opportunities[index]._id
    interest.person = t.context.people[index]._id
  })
  t.context.interests = await InterestArchive.create(interests).catch(() => 'Unable to create archived interest')
})

test.afterEach.always(async () => {
  await InterestArchive.deleteMany()
  await ArchivedOpportunity.deleteMany()
  await Person.deleteMany()
})

test.serial('Should correctly give number of Interests Arhived', async t => {
  t.plan(2)
  const res = await request(server)
    .get('/api/interestsArchived')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
  t.is(res.status, 200)
  t.is(res.body.length, t.context.interests.length)
})

test.serial('Should correctly give interest when queried by opportunity', async t => {
  t.plan(2)
  const res = await request(server)
    .get(`/api/interestsArchived?op=${t.context.opportunities[0]._id}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
  t.is(res.status, 200)
  t.is(res.body[0].comment, t.context.interests[0].comment)
})

test.serial('Should send correct data when queried against a _id', async t => {
  const res = await request(server)
    .get(`/api/interestsArchived/${t.context.interests[0]._id}`)
    .set('Accept', 'application/json')
  t.is(200, res.status)
  t.is(t.context.interests[0].person.toString(), res.body.person)
  t.is(t.context.interests[0].opportunity.toString(), res.body.opportunity)
})

test.serial('Should return 404 code when queried non existing interest', async t => {
  const res = await request(server).get('/api/interestsArchived/5cc8d60b8b16812b5b392123')
  const expectedResponseStatus = 404
  t.is(res.status, expectedResponseStatus)
})

test.serial('Should update the interest state from interested to attended', async t => {
  const reqData = {
    status: 'attended',
    _id: t.context.interests[1]._id,
    person: {
      nickname: t.context.people[0].nickname,
      _id: t.context.people[0]._id
    },
    comment: 'lol',
    opportunity: t.context.opportunities[2]._id,
    date: 'Sanitize it plz'
  }
  const res = await request(server)
    .put(`/api/interestsArchived/${t.context.interests[1]._id}`)
    .send(reqData)
    .set('Accept', 'application/json')
  t.is(res.status, 200)
  t.is(res.body.status, 'attended')
})

test.serial('Should correctly delete an interest', async t => {
  t.plan(2)
  const newInterestArchive = new InterestArchive({
    _id: '5cc8d60b8b16812b5b3920c9',
    person: t.context.people[0]._id,
    opportunity: t.context.opportunities[0]._id,
    comment: 'hello there'
  })
  await newInterestArchive.save()
  const res = await request(server)
    .delete(`/api/interestsArchived/${newInterestArchive._id}`)
    .set('Accept', 'application/json')
  t.is(res.status, 200)
  const queriedInterest = await InterestArchive.findOne({ _id: newInterestArchive._id }).exec()
  t.is(null, queriedInterest)
})
