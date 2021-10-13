import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Opportunity from '../opportunity'
import Person from '../../person/person'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from '../../person/__tests__/person.fixture'
import ops from './opportunity.fixture.js'
import tags from '../../tag/__tests__/tag.fixture'
import { jwtData, jwtDataDali } from '../../../middleware/session/__tests__/setSession.fixture'

const { regions } = require('../../location/locationData')

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add two oppo entries', async (t) => {
  // connect each oppo to a requestor.
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.tags = tags
  ops.forEach((op, index) => { op.requestor = t.context.people[index]._id })
  t.context.opportunities = await Opportunity.create(ops).catch((err) => console.error('Unable to create opportunities', err))
})

test.afterEach.always(async () => {
  await Opportunity.deleteMany()
  await Person.deleteMany()
})

test.serial('Op recommendations based on location should include those nearby and not requested by me', async t => {
  t.context.people[0].locations = [regions[0].containedTerritories[0]]
  await t.context.people[0].save()

  t.context.opportunities.forEach((op, index) => {
    op.location = regions[1].name // not my location
    op.requestor = t.context.people[1]._id // not me
  })

  const me = t.context.people[0]._id
  const numMatchingOps = 3

  // matches location but was requested by me
  t.context.opportunities[0].locations = [regions[0].name]
  t.context.opportunities[0].requestor = me

  // matches location
  t.context.opportunities[1].locations = [regions[0].containedTerritories[0]]
  t.context.opportunities[2].locations = [regions[0].containedTerritories[1]]
  t.context.opportunities[3].locations = [regions[0].name]

  t.context.opportunities.forEach(async op => {
    await op.save()
  })

  const res = await request(server)
    .get(`/api/opportunities/recommended?me=${me}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body

  // ensure all matches returned
  t.is(got.basedOnLocation.length, numMatchingOps)

  // ensure matches are ranked (i.e. closest match first)
  t.is(got.basedOnLocation[0].locations[0], regions[0].containedTerritories[0])
})

test.serial('Ops recommended based on skills should match at least one of my skills and be ranked', async t => {
  // set my tags as all tags but the first one in the db
  t.context.people[1].tags = t.context.tags.slice(1)
  await t.context.people[1].save()
  const me = t.context.people[1]._id

  const ops = t.context.opportunities
  ops.forEach((op) => {
    op.tags = []
    op.type = 'offer'
    op.requestor = t.context.people[2]._id // not me
  })

  const numMatchingOps = 3

  // matches but was requested by me (so shouldn't be included)
  ops[0].tags = t.context.tags
  ops[0].topicGroups = []
  ops[0].requestor = me

  // contains matches (in order of most to least)
  ops[1].tags = t.context.tags.slice(0)
  ops[2].tags = t.context.tags.slice(2)
  ops[3].tags = t.context.tags.slice(3)

  ops.forEach(async op => {
    await op.save()
  })

  const res = await request(server)
    .get(`/api/opportunities/recommended?me=${me}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body

  // ensure all matches returned
  t.is(got.basedOnSkills.length, numMatchingOps)
  // ensure matches are ranked (i.e. closest match first)
  t.is(got.basedOnSkills[0]._id, ops[1]._id.toString())
  t.is(got.basedOnSkills[1]._id, ops[2]._id.toString())
  t.is(got.basedOnSkills[2]._id, ops[3]._id.toString())
})

test.serial('When I havent provided any skills, nothing should be recommended', async t => {
  t.context.people[0].tags = []
  await t.context.people[0].save()
  const me = t.context.people[0]._id

  const ops = t.context.opportunities
  ops.forEach((op) => {
    op.tags = t.context.tags
    op.requestor = t.context.people[1]._id // not me
  })

  ops.forEach(async op => {
    await op.save()
  })

  const res = await request(server)
    .get(`/api/opportunities/recommended?me=${me}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body

  t.is(got.basedOnSkills.length, 0)
})

test.serial('Should return bad request when specified person does not exist in db', async t => {
  const res = await request(server)
    .get('/api/opportunities/recommended?me=999999999999999999999999')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])

  t.is(res.status, 400)
})
