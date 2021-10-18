import test from 'ava'
import request from 'supertest'
import Member from '../../../../server/api/member/member'
import { MemberStatus } from '../../../../server/api/member/member.constants'
import Organisation from '../../../../server/api/organisation/organisation'
import orgs from '../../../../server/api/organisation/__tests__/organisation.fixture'
import Person from '../../../../server/api/person/person'
import people from '../../../../server/api/person/__tests__/person.fixture'
import { jwtData, jwtDataDali } from '../../../../server/middleware/session/__tests__/setSession.fixture'
import { appReady, server } from '../../../../server/server'
import { startMongo, stopMongo } from '../../../util/mockMongo'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  try {
    t.context.orgs = await Organisation.create(orgs).catch(() => 'Unable to create orgs')
    t.context.org = t.context.orgs[0]

    t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
    t.context.andrew = t.context.people[0]
    t.context.dali = t.context.people[1]
    t.context.alice = t.context.people[2]

    const members = [
      {
        person: t.context.andrew._id,
        organisation: t.context.orgs[1]._id,
        validation: 'follower',
        status: MemberStatus.FOLLOWER
      },
      {
        person: t.context.andrew._id,
        organisation: t.context.orgs[0]._id,
        validation: 'orgAdmin',
        status: MemberStatus.ORGADMIN
      },
      {
        person: t.context.dali._id,
        organisation: t.context.orgs[2]._id,
        validation: 'member',
        status: MemberStatus.MEMBER
      }
    ]
    t.context.members = await Member.create(members).catch((err) => `Unable to create members: ${err}`)
    const orgid = t.context.org._id
    t.context.url = `/api/notify/org/${orgid}?memberStatus=member&memberValidation=%27test%20invitation%27`
    await appReady
  } catch (e) { console.error('notify.spec.js before error:', e) }
})

test.afterEach(t => {
  // Reset the mock back to the defaults after each test
})

test.serial('find my org - member of admin', async t => {
  const res = await request(server)
    .get('/my/org/admin')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 307)
  t.is(res.headers.location, `/orgs/${t.context.orgs[0]._id}`)
})

test.serial('find my org - no role', async t => {
  const res = await request(server)
    .get('/my/org')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 307)
  t.is(res.headers.location, `/orgs/${t.context.orgs[0]._id}`)
})

test.serial('find my org - not a vp member', async t => {
  const res = await request(server)
    .get('/my/org/vp')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 404)
})

test.serial('find my org - member of vp', async t => {
  const res = await request(server)
    .get('/my/org/vp')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
  t.is(res.status, 307)
  t.is(res.headers.location, `/orgs/${t.context.orgs[2]._id}`)
})

test.serial('find my org - not signed in ', async t => {
  const res = await request(server)
    .get('/my/org/vp')
    .set('Accept', 'application/json')
  t.is(res.status, 403)
})

test.serial('find my person - not signed in ', async t => {
  const res = await request(server)
    .get('/my/person')
    .set('Accept', 'application/json')
  t.is(res.status, 403)
})

test.serial('find my person - signed in ', async t => {
  const res = await request(server)
    .get('/my/person')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])

  t.is(res.status, 307)
  t.is(res.headers.location, `/people/${t.context.dali._id}`)
})
