import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import Person from '../../person/person'
import Tag from '../../tag/tag'
import Opportunity from '../opportunity'
import { OpportunityStatus } from '../opportunity.constants'
import people from '../../person/__tests__/person.fixture'
import ops from './opportunity.fixture.js'
import tags from '../../tag/__tests__/tag.fixture'

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.beforeEach('connect and add two oppo entries', async (t) => {
  // connect each oppo to a requestor.
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.tags = await Tag.create(tags).catch((err) => `Unable to create tags: ${err}`)
  ops.map((op, index) => { op.requestor = t.context.people[index]._id })
  t.context.opportunities = await Opportunity.create(ops).catch((err) => console.error('Unable to create opportunities', err))
})

test.afterEach.always(async t => {
  await Person.deleteMany()
  await Tag.deleteMany()
  await Opportunity.deleteMany()
})

test.serial('Anonymous users should receive 200 from GET by ID endpoint', async t => {
  const res = await request(server)
    .get(`/api/opportunities/${t.context.opportunities[0]._id}`)
    .set('Accept', 'application/json')
  t.is(200, res.status)
})

test.serial('Anonymous users should receive 404 from GET by ID endpoint if draft', async t => {
  const res = await request(server)
    .get(`/api/opportunities/${t.context.opportunities.filter(op => op.status === OpportunityStatus.DRAFT)[0]._id}`)
    .set('Accept', 'application/json')
  t.is(404, res.status)
})

test.serial('Anonymous users should receive 200 from GET all endpoint', async t => {
  const res = await request(server)
    .get(`/api/opportunities`)
    .set('Accept', 'application/json')
  t.is(200, res.status)
})

test.serial('Anonymous users should only receive active ops from GET all endpoint', async t => {
  const res = await request(server)
    .get(`/api/opportunities`)
    .set('Accept', 'application/json')
  t.is(res.body.filter(op => op.status !== OpportunityStatus.ACTIVE).length, 0)
})
