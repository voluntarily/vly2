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
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady

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

test.serial('Should correctly give number of Interests', async t => {
  t.plan(2)

  const res = await request(server)
    .get('/api/interests')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
    .expect(200)
  t.is(res.status, 200)
  t.deepEqual(res.body.length, t.context.interests.length)
})

test.serial('Should find interests matching the op', async t => {
  t.plan(3)
  const opid = t.context.ops[1]._id
  const res = await request(server)
    .get(`/api/interests?op=${opid}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
    .expect(200)
  t.is(res.status, 200)
  t.is(res.body.length, 1)
  // when asking for interests by opportunity we are not interested in getting another copy of the op.
  t.is(res.body[0].opportunity, opid.toString())
})

test.serial('Should find interests matching a person', async t => {
  t.plan(3)
  const personid = t.context.people[2]._id
  const res = await request(server)
    .get(`/api/interests?me=${personid}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
  t.is(res.status, 200)
  t.is(res.body.length, 1)
  // when asking for interests by opportunity we are not interested in getting another copy of the op.
  t.is(res.body[0].person, personid.toString())
})

test.serial('Should find interests matching an op + person', async t => {
  t.plan(3)
  const opid = t.context.ops[1]._id
  const personid = t.context.people[3]._id
  const res = await request(server)
    .get(`/api/interests?me=${personid}&op=${opid}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
  t.is(res.status, 200)
  t.is(res.body.length, 1)
  // when asking for interests by opportunity we are not interested in getting another copy of the op.
  t.is(res.body[0].person._id, personid.toString())
})
test.serial('Should not find interests matching an op + wrong person', async t => {
  t.plan(2)
  const opid = t.context.ops[1]._id
  const personid = t.context.people[2]._id
  const res = await request(server)
    .get(`/api/interests?me=${personid}&op=${opid}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
  t.is(res.status, 200)
  t.is(res.body.length, 0)
})

test.serial('Should 404 on invalid op search', async t => {
  const res = await request(server)
    .get('/api/interests?op=rubbish')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
  t.is(res.status, 404)
})

test.serial('Should send correct data when queried against a _id', async t => {
  const interest = t.context.interests[0]
  const res = await request(server)
    .get(`/api/interests/${interest._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(200, res.status)
  t.is(interest.person.toString(), res.body.person)
  t.is(interest.opportunity.toString(), res.body.opportunity)
})

test.serial('Should return 404 code when queried non existing interest', async t => {
  const res = await request(server)
  // use a valid objectid but one that is not an interest record
    .get('/api/interests/5cc8d60b8b16812b5babcdef')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  const expectedResponseStatus = 404
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
      .set('Cookie', [`idToken=${jwtData.idToken}`])
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
    .set('Cookie', [`idToken=${jwtData.idToken}`])

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
  // interests 2 has a single date - so should trigger a calendar event to be attached
  const interest = t.context.interests[2]
  const reqData = {
    _id: interest._id,
    status: 'invited'
  }

  const res = await request(server)
    .put(`/api/interests/${interest._id}`)
    .send(reqData)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
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
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)
  t.is(res.body.status, 'committed')
})

test.serial('Should update the interest state from to declined', async t => {
  // interests 2 has a single date - so should trigger a calendar event to be attached
  const interest = t.context.interests[4]
  const reqData = {
    _id: interest._id,
    status: 'declined'
  }

  const res = await request(server)
    .put(`/api/interests/${interest._id}`)
    .send(reqData)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 200)
  t.is(res.body.status, 'declined')
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
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)

  const queriedInterest = await Interest.findOne({
    _id: newInterest._id
  }).exec()
  t.is(null, queriedInterest)
})

test.serial('Should get 404 updating an interest with invalid id', async t => {
  const reqData = {
    _id: '5d2905d9a792f000114a557b',
    status: 'invited'
  }

  const res = await request(server)
    .put(`/api/interests/${reqData._id}`)
    .send(reqData)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 404)
})

test.serial('Should not return interests with null person field', async t => {
  const newPerson = await Person.create({
    name: 'Test McTest',
    email: 'testy@example.com'
  })

  const newInterest = await Interest.create({
    person: newPerson._id,
    opportunity: t.context.ops[0]._id,
    comment: 'XYZ test comment',
    status: 'interested'
  })

  const firstResponse = await request(server)
    .get(`/api/interests/?op=${t.context.ops[0]._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send()

  t.is(firstResponse.status, 200)
  t.is(
    firstResponse.body.filter((opportunity) => opportunity.comment === 'XYZ test comment').length,
    1
  )

  await Person.deleteOne(newPerson)

  // at this point we now have an interest with no associated person record
  // so the Interests API should not return that interest any more
  const secondResponse = await request(server)
    .get(`/api/interests/?op=${t.context.ops[0]._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send()

  // clean up the new interest record created just for this test
  await Interest.deleteOne(newInterest)

  t.is(secondResponse.status, 200)
  t.is(
    secondResponse.body.filter((opportunity) => opportunity.comment === 'XYZ test comment').length,
    0
  )
})
