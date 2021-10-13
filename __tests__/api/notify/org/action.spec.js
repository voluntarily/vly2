import test from 'ava'
import request from 'supertest'
import Member from '../../../../server/api/member/member'
import { MemberStatus } from '../../../../server/api/member/member.constants'
import Organisation from '../../../../server/api/organisation/organisation'
import orgs from '../../../../server/api/organisation/__tests__/organisation.fixture'
import Person from '../../../../server/api/person/person'
import people from '../../../../server/api/person/__tests__/person.fixture'
import { jwtDataAlice, jwtDataDali } from '../../../../server/middleware/session/__tests__/setSession.fixture'
import { appReady, server } from '../../../../server/server'
import MemoryMongo from '../../../../server/util/test-memory-mongo'
import { makeURLToken } from '../../../../lib/sec/actiontoken'

test.before('before connect to database', async (t) => {
  try {
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
    t.context.orgs = await Organisation.create(orgs).catch(() => 'Unable to create orgs')
    t.context.org = t.context.orgs[0]

    t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
    t.context.andrew = t.context.people[0]
    t.context.dali = t.context.people[1]
    t.context.alice = t.context.people[2]

    const members = [
      {
        person: t.context.andrew._id,
        organisation: t.context.orgs[0]._id,
        validation: 'action.spec.js orgAdmin',
        status: MemberStatus.ORGADMIN
      },
      {
        person: t.context.dali._id,
        organisation: t.context.orgs[0]._id,
        validation: 'action.spec.js follower',
        status: MemberStatus.FOLLOWER
      }
    ]
    t.context.members = await Member.create(members).catch((err) => `Unable to create members: ${err}`)

    // construct a token
    const orgid = t.context.org._id
    const orgAdmin = t.context.andrew._id

    const payload = {
      landingUrl: '/api/notify/org/action',
      redirectUrl: `/orgs/${orgid}`,
      data: {
        orgid,
        orgAdmin,
        memberStatus: MemberStatus.MEMBER,
        memberValidation: 'action.spec.js test'
      },
      action: 'join',
      expiresIn: '2d'
    }
    // t.context.token = makeURLToken(payload)
    t.context.token = new URL(makeURLToken(payload)).searchParams.get('token')

    await appReady
  } catch (e) { console.error('notify.spec.js before error:', e) }
})

test('token allows me to join org as a member ', async t => {
  // confirm Alices is not a member
  const membershipQuery = {
    person: t.context.alice._id,
    organisation: t.context.org._id
  }
  // show alice is not currently a member
  let membership = await Member.findOne(membershipQuery).exec()
  t.falsy(membership)
  const url = `/api/notify/org/action?token=${t.context.token}`
  const res = await request(server)
    .get(url)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])
    // .expect('Content-Type', /json/)

  // if successful will redirect to the final destination
  t.is(res.status, 307)
  t.is(res.header.location, `/orgs/${t.context.org._id}`)

  // and the members record will exist
  membership = await Member.findOne(membershipQuery).exec()
  t.truthy(membership)
  t.is(membership.status, MemberStatus.MEMBER)
})

// link with non signed in person - should redirect
test('token redirects non-signed in person to sign-thru ', async t => {
  const url = `/api/notify/org/action?token=${t.context.token}`
  const res = await request(server)
    .get(url)
    .set('Accept', 'application/json')
    // .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])
    // .expect('Content-Type', /json/)

  // if successful will redirect to the final destination
  t.is(res.status, 307)
  t.is(res.header.location, `/auth/sign-thru?redirect=${url}`)
})

test('token with existing follower should update to member', async t => {
  // confirm Dali is a member
  const membershipQuery = {
    person: t.context.dali._id,
    organisation: t.context.org._id
  }
  // show Dali is currently a follower
  let membership = await Member.find(membershipQuery).exec()
  t.is(membership.length, 1)
  t.is(membership[0].status, MemberStatus.FOLLOWER)

  const url = `/api/notify/org/action?token=${t.context.token}`
  let res = await request(server)
    .get(url)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    // .expect('Content-Type', /json/)

  // if successful will redirect to the final destination
  t.is(res.status, 307)
  t.is(res.header.location, `/orgs/${t.context.org._id}`)

  // and the members record will exist
  membership = await Member.find(membershipQuery).exec()
  t.is(membership.length, 1) // still only one record
  t.is(membership[0].status, MemberStatus.MEMBER)

  // repeating the call - no new records
  res = await request(server)
    .get(url)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    // .expect('Content-Type', /json/)

  // if successful will redirect to the final destination
  t.is(res.status, 307)
  t.is(res.header.location, `/orgs/${t.context.org._id}`)
  // and the members record has not changed
  membership = await Member.find(membershipQuery).exec()
  t.is(membership.length, 1) // still only one record
  t.is(membership[0].status, MemberStatus.MEMBER)
})
