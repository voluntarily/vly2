import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import { InterestArchive } from '../interest'
import ArchivedOpportunity from '../../archivedOpportunity/archivedOpportunity'
import Person from '../../person/person'
import MemoryMongo from '../../../util/test-memory-mongo'
import interests from './interestArchive.fixture'
import people from '../../person/__tests__/person.fixture'
import archivedOps from '../../archivedOpportunity/__tests__/archivedOpportunity.fixture.js'
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'
import { InterestStatus } from '../interest.constants'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and set up test fixture', async (t) => {
  t.context.people = await Person.create(people)
  archivedOps.map((op, index) => { op.requestor = t.context.people[0]._id })
  t.context.opportunities = await ArchivedOpportunity.create(archivedOps)
  interests.map((interest, index) => {
    interest.opportunity = t.context.opportunities[index]._id
    interest.person = t.context.people[index]._id
    interest.messages = [{ // this works whether its an object or array.
      body: `${t.context.people[index].name} is interested.`,
      author: t.context.people[index]._id
    }]
    interest.type = 'accept'
  })
  t.context.interests = await InterestArchive.create(interests)
})

test.afterEach.always(async () => {
  await InterestArchive.deleteMany()
  await ArchivedOpportunity.deleteMany()
  await Person.deleteMany()
})

test.only('Should correctly give number of Interests Archived', async t => {
  t.plan(2)
  const res = await request(server)
    .get('/api/interestArchives')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    // .expect('Content-Type', /json/)
  t.is(res.status, 200)
  t.is(res.body.length, t.context.interests.length)
})

test.serial('Should correctly give interest when queried by opportunity', async t => {
  t.plan(2)
  const res = await request(server)
    .get(`/api/interestArchives?op=${t.context.opportunities[0]._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
  t.is(res.status, 200)
  t.is(res.body[0].messages[0].body, t.context.interests[0].messages[0].body)
})

test.serial('Should send correct data when queried against a _id', async t => {
  const res = await request(server)
    .get(`/api/interestArchives/${t.context.interests[0]._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(200, res.status)
  t.is(t.context.interests[0].person.toString(), res.body.person)
  t.is(t.context.interests[0].opportunity.toString(), res.body.opportunity)
})

test.serial('Should return 404 code when queried non existing interest', async t => {
  const res = await request(server)
    .get('/api/interestArchives/5cc8d60b8b16812b5b392123')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  const expectedResponseStatus = 404
  t.is(res.status, expectedResponseStatus)
})

test.serial('Should update the interest state from interested to attended', async t => {
  const reqData = {
    status: InterestStatus.ATTENDED,
    _id: t.context.interests[1]._id,
    person: {
      nickname: t.context.people[0].nickname,
      _id: t.context.people[0]._id
    },
    messages: [{ // this works whether its an object or array.
      body: 'Well done',
      author: t.context.people[0]._id
    }],
    type: 'accept',
    opportunity: t.context.opportunities[2]._id,
    date: 'Sanitize it plz'
  }
  const res = await request(server)
    .put(`/api/interestArchives/${t.context.interests[1]._id}`)
    .send(reqData)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 200)
  t.is(res.body.status, 'attended')
})

test.serial('Should correctly delete an interest', async t => {
  t.plan(2)
  const newInterestArchive = new InterestArchive({
    _id: '5cc8d60b8b16812b5b3920c9',
    person: t.context.people[0]._id,
    status: InterestStatus.NOTATTENDED,
    messages: [{ // this works whether its an object or array.
      body: 'Well done',
      author: t.context.people[0]._id
    }],
    type: 'accept',
    opportunity: t.context.opportunities[0]._id
  })
  await newInterestArchive.save()
  const res = await request(server)
    .delete(`/api/interestArchives/${newInterestArchive._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 200)
  const queriedInterest = await InterestArchive.findOne({ _id: newInterestArchive._id }).exec()
  t.is(null, queriedInterest)
})
