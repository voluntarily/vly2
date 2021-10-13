import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import { InterestArchive } from '../interest'
import { InterestStatus } from '../interest.constants'
import MemoryMongo from '../../../util/test-memory-mongo'
import ArchivedOpportunity from '../../archivedOpportunity/archivedOpportunity'
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

  t.context.people = await Person.create(people)
  t.context.me = t.context.people[0] // I am the first person.
  t.context.orgs = await Organisation.create(orgs)

  // setup opportunities 5 items
  ops.forEach((op, index) => {
    // each op has a different person as requestor, but not me
    op.requestor = t.context.people[index + 1]._id
    // all the ops belong to the OMGTech org
    op.offerOrg = t.context.orgs[1]._id
  })
  t.context.ops = await ArchivedOpportunity.create(ops)

  // setup interests
  // each op has person + 2 interested.
  const interests = t.context.ops.forEach((op, index) => {
    const enquirer = t.context.people[index + 2]
    return {
      person: enquirer._id,
      opportunity: op._id,
      // deprecated comment: `${index} ${enquirer.nickname} interested in ${op.name}`,
      messages: [{
        body: `${index} ${enquirer.name} interested in ${op.name}`,
        author: enquirer._id
      }],
      status: InterestStatus.COMMITTED,
      type: 'accept'
    }
  })
  t.context.interests = await InterestArchive.create(interests)
})

test.serial('Should correctly give number of Interests', async t => {
  const is = await InterestArchive.find().exec()
  t.is(is.length, t.context.interests.length)
  const res = await request(server)
    .get('/api/interestArchives')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
    .expect(200)
  t.is(res.status, 200)
  t.deepEqual(res.body.length, t.context.interests.length)
})

test.serial('Should find archived interests matching the op', async t => {
  t.plan(3)
  const opid = t.context.ops[1]._id
  const res = await request(server)
    .get(`/api/interestArchives?op=${opid}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
    .expect(200)
  t.is(res.status, 200)
  t.is(res.body.length, 1)
  // when asking for interests by opportunity we are not interested in getting another copy of the op.
  t.is(res.body[0].opportunity, opid.toString())
})

test.serial('Should find archived interests matching a person', async t => {
  t.plan(3)
  const personid = t.context.people[2]._id
  const res = await request(server)
    .get(`/api/interestArchives?me=${personid}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
  t.is(res.status, 200)
  t.is(res.body.length, 1)
  // when asking for interests by opportunity we are not interested in getting another copy of the op.
  t.is(res.body[0].person, personid.toString())
})

test.serial('Should find archived interests matching an op + person', async t => {
  t.plan(3)
  const opid = t.context.ops[1]._id
  const personid = t.context.people[3]._id
  const res = await request(server)
    .get(`/api/interestArchives?me=${personid}&op=${opid}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
  t.is(res.status, 200)
  t.is(res.body.length, 1)
  // when asking for interests by opportunity we are not interested in getting another copy of the op.
  t.is(res.body[0].person._id, personid.toString())
})
test.serial('Should not find archived interests matching an op + wrong person', async t => {
  t.plan(2)
  const opid = t.context.ops[1]._id
  const personid = t.context.people[2]._id
  const res = await request(server)
    .get(`/api/interestArchives?me=${personid}&op=${opid}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
  t.is(res.status, 200)
  t.is(res.body.length, 0)
})

test.serial('Should 404 on invalid op search', async t => {
  const res = await request(server)
    .get('/api/interestArchives?op=rubbish')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
  t.is(res.status, 404)
})

test.serial('Should send correct data when queried against a _id', async t => {
  const interest = t.context.interests[0]
  const res = await request(server)
    .get(`/api/interestArchives/${interest._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(200, res.status)
  t.is(interest.person.toString(), res.body.person)
  t.is(interest.opportunity.toString(), res.body.opportunity)
})

test.serial('Should return 404 code when queried non existing interest', async t => {
  const res = await request(server)
  // use a valid objectid but one that is not an interest record
    .get('/api/interestArchives/5cc8d60b8b16812b5babcdef')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  const expectedResponseStatus = 404
  t.is(res.status, expectedResponseStatus)
})

test.serial('Should not allow create of an archived interest', async t => {
  const me = t.context.me
  const op = t.context.ops[0]
  const newInterest = {
    person: me._id,
    opportunity: op._id,
    status: 'InterestStatus.COMMITTED',
    messages: [{
      body: `${me.name} is interested in ${op.name}`,
      author: me._id
    }]
  }

  const res = await request(server)
    .post('/api/interestArchives')
    .send(newInterest)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 403)
})

test.serial('Should update the interest state from committed to attended', async t => {
  const interest = t.context.interests[4]
  const reqData = {
    _id: interest._id,
    status: InterestStatus.ATTENDED,
    type: 'accept'
  }

  const res = await request(server)
    .put(`/api/interestArchives/${interest._id}`)
    .send(reqData)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 200)
  const savedInterest = res.body
  t.is(savedInterest.status, InterestStatus.ATTENDED)

  // no extra message should be added.
  t.is(savedInterest.messages.length, 0)
})

test.serial('Should update the interest state from committed to not attended', async t => {
  const interest = t.context.interests[3]
  const reqData = {
    _id: interest._id,
    status: InterestStatus.NOTATTENDED,
    type: 'reject'
  }

  const res = await request(server)
    .put(`/api/interestArchives/${interest._id}`)
    .send(reqData)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)
  t.is(res.body.status, InterestStatus.NOTATTENDED)
})

test.serial('Should not delete an archived interest', async t => {
  const me = t.context.me
  const op = t.context.ops[4]
  const newInterest = new InterestArchive({
    _id: '5cc8d60b8b16812b5b3920c9',
    person: me._id,
    opportunity: op._id,
    status: InterestStatus.NOTATTENDED,
    messages: []
  })

  await newInterest.save()

  const res = await request(server)
    .delete(`/api/interestArchives/${newInterest._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 403)
})

test.serial('Should get 404 updating an interest with invalid id', async t => {
  const reqData = {
    _id: '5d2905d9a792f000114a557b',
    status: InterestStatus.ATTENDED,
    type: 'accept'
  }

  const res = await request(server)
    .put(`/api/interestArchives/${reqData._id}`)
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

  const newInterest = await InterestArchive.create({
    person: newPerson._id,
    opportunity: t.context.ops[0]._id,
    messages: {
      body: 'XYZ test comment',
      author: newPerson._id
    },
    status: InterestStatus.INTERESTED
  })

  const firstResponse = await request(server)
    .get(`/api/interestArchives/?op=${t.context.ops[0]._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send()

  t.is(firstResponse.status, 200)
  t.is(
    firstResponse.body.filter((opportunity) => opportunity.messages[0].body === 'XYZ test comment').length,
    1
  )

  await Person.deleteOne(newPerson)

  // at this point we now have an interest with no associated person record
  // so the Interests API should not return that interest any more
  const secondResponse = await request(server)
    .get(`/api/interestArchives/?op=${t.context.ops[0]._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send()

  // clean up the new interest record created just for this test
  await InterestArchive.deleteOne(newInterest)

  t.is(secondResponse.status, 200)
  t.is(
    secondResponse.body.filter((opportunity) => opportunity.messages[0].body === 'XYZ test comment').length,
    0
  )
})
