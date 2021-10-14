import test from 'ava'
import nodemailerMock from 'nodemailer-mock'
import request from 'supertest'
import Member from '../../../../server/api/member/member'
import { MemberStatus } from '../../../../server/api/member/member.constants'
import Organisation from '../../../../server/api/organisation/organisation'
import orgs from '../../../../server/api/organisation/__tests__/organisation.fixture'
import Person from '../../../../server/api/person/person'
import people from '../../../../server/api/person/__tests__/person.fixture'
import { jwtData, jwtDataAlice, jwtDataDali } from '../../../../server/middleware/session/__tests__/setSession.fixture'
import { appReady, server } from '../../../../server/server'
import { startMongo, stopMongo } from '../../../../util/mockMongo'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  process.env.mockEmails = true
  try {
    t.context.orgs = await Organisation.create(orgs)
    t.context.org = t.context.orgs[0]

    t.context.people = await Person.create(people)
    t.context.andrew = t.context.people[0]
    t.context.dali = t.context.people[1]
    t.context.alice = t.context.people[2]

    const members = [
      {
        person: t.context.andrew._id,
        organisation: t.context.orgs[0]._id,
        validation: 'orgAdmin',
        status: MemberStatus.ORGADMIN
      },
      {
        person: t.context.dali._id,
        organisation: t.context.orgs[0]._id,
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
  nodemailerMock.mock.reset()
})

test.serial('I can find my membership', async t => {
  const membershipQuery = {
    person: t.context.andrew._id,
    organisation: t.context.org._id
  }
  const membership = await Member.findOne(membershipQuery)
  t.is(membership.status, MemberStatus.ORGADMIN)
})

test.serial('Fail to access notify api as not signed in', async t => {
  const res = await request(server)
    .get(t.context.url)
    .set('Accept', 'application/json')
  t.is(res.status, 403)
})
test.serial('Fail to access notify api as not a member of org', async t => {
  const res = await request(server)
    .get(t.context.url)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])
    .expect('Content-Type', /json/)
  t.is(res.status, 403)
})
test.serial('Fail to access notify api as not an orgAdmin of org', async t => {
  const res = await request(server)
    .get(t.context.url)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .expect('Content-Type', /json/)
  t.is(res.status, 403)
})
test.serial('trigger an email inviting the recipient to become a member of an organisation', async t => {
  const res = await request(server)
    .get(t.context.url)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  t.is(res.status, 200)
  t.truthy(res.body.info.response, 'nodemailer-mock success')
  t.truthy(res.body.info.originalMessage.subject.includes('Inviting you to join Voluntarily Administrators'))
})
