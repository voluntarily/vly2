import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import Person from '../../person/person'
import Tag from '../../tag/tag'
import Opportunity from '../opportunity'
import { OpportunityStatus, OpportunityFields } from '../opportunity.constants'
import people from '../../person/__tests__/person.fixture'
import ops from './opportunity.fixture.js'
import tags from '../../tag/__tests__/tag.fixture'
import { ObjectId } from 'mongodb'

const assertContainsOnlyAnonymousFields = (test, obj) => {
  const permittedFields = [
    OpportunityFields.ID,
    OpportunityFields.NAME,
    OpportunityFields.SUBTITLE,
    OpportunityFields.IMG_URL,
    OpportunityFields.DURATION
  ]
  for (const key of Object.keys(obj)) {
    test.true(permittedFields.includes(key), `The response contained an invalid field: '${key}'`)
  }
}

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
  t.context.people = await Person.create(people)
  t.context.tags = await Tag.create({ tags })
  for (let index = 0; index < ops.length; index++) {
    ops[index].requestor = t.context.people[index]._id
  }
  t.context.opportunities = await Opportunity.create(ops)
})

test.serial('Anonymous - READ by id', async t => {
  const res = await request(server)
    .get(`/api/opportunities/${t.context.opportunities[0]._id}`)
    .set('Accept', 'application/json')

  t.is(200, res.status)
  assertContainsOnlyAnonymousFields(t, res.body)
})

test.serial('Anonymous users should receive 404 from GET by ID endpoint if draft', async t => {
  const res = await request(server)
    .get(`/api/opportunities/${t.context.opportunities.filter(op => op.status === OpportunityStatus.DRAFT)[0]._id}`)
    .set('Accept', 'application/json')
  t.is(404, res.status)
})

test.serial('Anonymous - LIST', async t => {
  const res = await request(server)
    .get('/api/opportunities')
    .set('Accept', 'application/json')
  
  t.is(200, res.status)
  for (const op of res.body) {
    assertContainsOnlyAnonymousFields(t, op)
  }
})

test.serial('Anonymous users should only receive active ops from GET all endpoint', async t => {
  const res = await request(server)
    .get('/api/opportunities')
    .set('Accept', 'application/json')

  const resIds = res.body.map(op => op._id)

  // Get ACTIVE ops from the database (for the IDs in the response)
  const activeOpsForIds = await Opportunity.find(
    {
      _id: { 
        $in: resIds.map(id => new ObjectId(id))
      },
      status: OpportunityStatus.ACTIVE
    }
  )

  t.is(res.body.length, activeOpsForIds.length)
})

test.serial('Anonymous - CREATE is denied', async t => {
  const res = await request(server)
    .post('/api/opportunities')
    .set('Accept', 'application/json')
    .send({})

  t.is(403, res.status)
})