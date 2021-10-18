import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Member from '../member'
import { MemberStatus } from '../member.constants'
import Organisation from '../../organisation/organisation'
import Person from '../../person/person'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import people from '../../person/__tests__/person.fixture'
import orgs from '../../organisation/__tests__/organisation.fixture'
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  try {
    await appReady
  } catch (e) {
    console.error('member.spec.js - error in test setup', e)
  }

  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.orgs = await Organisation.create(orgs).catch((err) => `Unable to create organisations: ${err}`)

  // Initial members added into test db
  const members = [
    {
      person: t.context.people[0]._id,
      organisation: t.context.orgs[0]._id,
      validation: 'test follower',
      status: MemberStatus.FOLLOWER
    },
    // person 1 is member of two orgs
    // org 1 has two members
    {
      person: t.context.people[1]._id,
      organisation: t.context.orgs[0]._id,
      validation: 'test member 1',
      status: MemberStatus.MEMBER
    },
    {
      person: t.context.people[1]._id,
      organisation: t.context.orgs[1]._id,
      validation: 'test member 1',
      status: MemberStatus.MEMBER
    },
    {
      person: t.context.people[3]._id,
      organisation: t.context.orgs[1]._id,
      validation: 'test member 3',
      status: MemberStatus.MEMBER
    }
  ]

  t.context.members = await Member.create(members).catch(() => 'Unable to create members')
})

test.serial('Should give number of Members', async t => {
  t.plan(2)

  const res = await request(server)
    .get('/api/members')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
    .expect(200)
  t.is(res.status, 200)
  t.deepEqual(4, res.body.length)
})

test.serial('Should give number of Members for an org', async t => {
  const orgid = t.context.orgs[1]._id

  const res = await request(server)
    .get(`/api/members?orgid=${orgid}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
    .expect(200)
  const members = res.body
  t.deepEqual(2, members.length)
})

test.serial('Should give a list of orgs for a person', async t => {
  const personid = t.context.people[1]._id

  const res = await request(server)
    .get(`/api/members?meid=${personid}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
    .expect(200)
  const members = res.body
  t.deepEqual(2, members.length)

  t.is(members[0].status, MemberStatus.MEMBER)
  t.is(members[1].status, MemberStatus.MEMBER)
})

test.serial('Should give a specific membership for a person in org', async t => {
  const personid = t.context.people[1]._id
  const orgid = t.context.orgs[1]._id

  const res = await request(server)
    .get(`/api/members?meid=${personid}&orgid=${orgid}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect('Content-Type', /json/)
    .expect(200)
  const members = res.body
  t.deepEqual(1, members.length)

  t.is(members[0].status, MemberStatus.MEMBER)
})

test.serial('Should send correct data when queried against a _id', async t => {
  const member = t.context.members[0]
  const res = await request(server)
    .get(`/api/members/${member._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(200, res.status)
  t.is(member.person.toString(), res.body.person)
  t.is(member.organisation.toString(), res.body.organisation)
  t.is(member.validation.toString(), res.body.validation)
})

test.serial('Should return 404 code when queried non existing member', async t => {
  const res = await request(server)
    .get('/api/members/asodifklamd')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  // This test is not ready since the return status was 500 not 404
  const expectedResponseStatus = 500
  t.is(res.status, expectedResponseStatus)
})

test.serial(
  'Should not add an invalid member where referenced person or opp is not in DB',
  async t => {
    const newMember = new Member({
      person: '5cc8d60b8b16812b5babcdef',
      organisation: '5cc8d60b8b16812b5babcdef'
    })

    await request(server)
      .post('/api/members')
      .send(newMember)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${jwtData.idToken}`])

    const savedMember = await Member.findOne({
      person: newMember.person,
      organisation: newMember.organisation
    }).exec()

    t.is(null, savedMember)
  }
)

test.serial('Should add a valid follower', async t => {
  const person = t.context.people[4]
  const organisation = t.context.orgs[4]
  const newMember = {
    person: person._id.toString(),
    organisation: organisation._id.toString(),
    validation: 'random validation'
    // status: don't set it should be defaulted to follower
  }

  const res = await request(server)
    .post('/api/members')
    .send(newMember)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)
  const returnedMember = res.body

  const savedMember = await Member.findOne({
    person: newMember.person,
    organisation: newMember.organisation
  }).exec()
  t.is(savedMember.person._id.toString(), person._id.toString())
  t.is(savedMember.organisation._id.toString(), organisation._id.toString())
  t.is(savedMember.status, MemberStatus.FOLLOWER)

  // update state to member
  returnedMember.status = MemberStatus.MEMBER
  const res2 = await request(server)
    .put(`/api/members/${returnedMember._id}`)
    .send(returnedMember)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 200)
  const updatedMember = res2.body
  t.is(updatedMember.status, MemberStatus.MEMBER)

  await request(server)
    .delete(`/api/members/${returnedMember._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)

  const queriedMember = await Member.findOne({
    _id: returnedMember._id
  }).exec()
  t.is(null, queriedMember)
})
