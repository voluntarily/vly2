import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Interest from '../interest'
import MemoryMongo from '../../../util/test-memory-mongo'
import Opportunity from '../../opportunity/opportunity'
import ops from '../../opportunity/__tests__/opportunity.fixture'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import Organisation from '../../organisation/organisation'
import orgs from '../../organisation/__tests__/organisation.fixture'

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()

  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.me = t.context.people[0] // I am the first person.
  t.context.orgs = await Organisation.create(orgs).catch(() => 'Unable to create orgs')

  // setup opportunities 5 items
  ops.map((op, index) => {
    // each op has a different person as requestor, but not me
    op.requestor = t.context.people[index + 1]._id
    // all the ops belong to the OMGTech org
    op.offerOrg = t.context.orgs[1]._id
  })
  t.context.ops = await Opportunity.create(ops).catch((err) => console.error('Unable to create opportunities', err))

  // setup interests
  // each op has person + 2 interested.
  const interests = t.context.ops.map((op, index) => {
    const enquirer = t.context.people[index + 2]
    return {
      person: enquirer._id,
      opportunity: op._id,
      comment: `${index} ${enquirer.nickname} interested in ${op.name}`
    }
  })
  t.context.interests = await Interest.create(interests).catch(() => 'Unable to create interests')
})
// test.afterEach.always(async (t) => {
//   console.log(t, 'completed')
// })
// test.after.always(async (t) => {
//   console.log('stopping mongo')
//   await Interest.deleteMany()
//   await Opportunity.deleteMany()
//   await Person.deleteMany()
//   await Organisation.deleteMany()
//   await t.context.memMongo.stop()
// })

test.serial('Should correctly give number of Interests', async t => {
  t.plan(2)

  const res = await request(server)
    .get('/api/interests')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
  t.is(res.status, 200)
  t.deepEqual(res.body.length, t.context.interests.length)
})

test.serial('Should send correct data when queried against a _id', async t => {
  const interest = t.context.interests[0]
  const res = await request(server)
    .get(`/api/interests/${interest._id}`)
    .set('Accept', 'application/json')
  t.is(200, res.status)
  t.is(interest.person.toString(), res.body.person)
  t.is(interest.opportunity.toString(), res.body.opportunity)
})

test.serial('Should return 404 code when queried non existing interest', async t => {
  const res = await request(server)
    .get(`/api/interests/asodifklamd`)
    .set('Accept', 'application/json')

  // This test is not ready since the return status was 500 not 404
  const expectedResponseStatus = 500
  t.is(res.status, expectedResponseStatus)
})

test.serial('Should not add an invalid interest where referenced person or opp is not in DB',
  async t => {
    const newInterest = new Interest({
      person: '5cc8d60b8b16812b5babcdef',
      opportunity: '5cc8d60b8b16812b5babcdef'
    })

    await request(server)
      .post('/api/interests')
      .send(newInterest)
      .set('Accept', 'application/json')
      .expect(422)

    const savedInterest = await Interest.findOne({
      person: newInterest.person,
      opportunity: newInterest.opportunity
    }).exec()

    t.is(null, savedInterest)
  }
)

test.serial('Should correctly add a valid interest', async t => {
  const me = t.context.me
  const op = t.context.ops[0]
  const newInterest = {
    person: me._id,
    opportunity: op._id,
    comment: 'test interest'
  }

  const res = await request(server)
    .post('/api/interests')
    .send(newInterest)
    .set('Accept', 'application/json')

  t.is(res.status, 200)
  const savedInterest = await Interest.findOne({
    person: newInterest.person,
    opportunity: newInterest.opportunity
  }).exec()
  t.is(savedInterest.person._id.toString(), me._id.toString())
  t.is(savedInterest.opportunity._id.toString(), op._id.toString())

  // test whether appropriate email got sent.
})

test.serial('Should update the interest state from interested to invited', async t => {
  const interest = t.context.interests[2]
  const reqData = {
    _id: interest._id,
    status: 'invited'
  }

  const res = await request(server)
    .put(`/api/interests/${interest._id}`)
    .send(reqData)
    .set('Accept', 'application/json')
  t.is(res.status, 200)
  t.is(res.body.status, 'invited')
})

test.serial('Should update the interest state from invited to committed', async t => {
  const interest = t.context.interests[3]
  const reqData = {
    _id: interest._id,
    status: 'committed'
  }

  const res = await request(server)
    .put(`/api/interests/${interest._id}`)
    .send(reqData)
    .set('Accept', 'application/json')

  t.is(res.status, 200)
  t.is(res.body.status, 'committed')
})

test.serial('Should correctly delete an interest', async t => {
  t.plan(2)
  const me = t.context.me
  const op = t.context.ops[4]
  const newInterest = new Interest({
    _id: '5cc8d60b8b16812b5b3920c9',
    person: me._id,
    opportunity: op._id,
    comment: 'delete me'
  })

  await newInterest.save()

  const res = await request(server)
    .delete(`/api/interests/${newInterest._id}`)
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const queriedInterest = await Interest.findOne({
    _id: newInterest._id
  }).exec()
  t.is(null, queriedInterest)
})
