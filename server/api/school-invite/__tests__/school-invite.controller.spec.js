import test from 'ava'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import { SchoolInvite } from '../school-invite.controller'
import { Role } from '../../../services/authorize/role'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import SchoolLookUp from '../../school-lookup/school-lookup'
import nodemailerMock from 'nodemailer-mock'
import fixtures from './school-invite.fixture'
import Person from '../../person/person'
import { MemberStatus } from '../../member/member.constants'
import { TOPIC_MEMBER__UPDATE } from '../../../services/pubsub/topic.constants'
import PubSub from 'pubsub-js'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {

})

test.beforeEach('Load fixtures', async (t) => {
  await SchoolLookUp.create(fixtures.schools)
  await Person.create(fixtures.people)
})

test.afterEach.always('Clear fixtures', async (t) => {
  await SchoolLookUp.deleteMany({})
  await Person.deleteMany({})
})

test.serial('Invalid HTTP methods', async (t) => {
  for (const method of ['GET', 'PUT', 'DELETE']) {
    const request = new MockExpressRequest({ method })
    const response = new MockExpressResponse()

    await SchoolInvite.send(request, response)

    t.is(404, response.statusCode, `${method} requests should result in 404`)
  }
})

test.serial('Not logged in', async (t) => {
  const request = new MockExpressRequest({ method: 'POST' })
  const response = new MockExpressResponse()

  await SchoolInvite.send(request, response)

  t.is(403, response.statusCode, `Received ${response.statusCode} instead of 403`)
})

test.serial('Valid login, missing body', async (t) => {
  const request = new MockExpressRequest({
    method: 'POST',
    session: {
      isAuthenticated: true,
      me: {
        role: [Role.ADMIN]
      }
    }
  })
  const response = new MockExpressResponse()

  await SchoolInvite.send(request, response)

  t.is(400, response.statusCode, `Received ${response.statusCode} instead of 400`)
})

test.serial('Valid login, missing required data', async (t) => {
  const request = new MockExpressRequest({
    method: 'POST',
    session: {
      isAuthenticated: true,
      me: {
        role: [Role.ADMIN]
      }
    },
    body: {
      invalidField: 'test'
    }
  })
  const response = new MockExpressResponse()

  await SchoolInvite.send(request, response)

  t.is(400, response.statusCode, `Received ${response.statusCode} instead of 400`)
  t.deepEqual({
    message: 'Missing required fields (schoolId, inviteeName, inviteeEmail)'
  }, response._getJSON())
})

test.serial('Valid login, required data, invalid school id', async (t) => {
  const request = new MockExpressRequest({
    method: 'POST',
    session: {
      isAuthenticated: true,
      me: {
        role: [Role.ADMIN]
      }
    },
    body: {
      schoolId: 2,
      inviteeName: 'Test Testington',
      inviteeEmail: 'test@example.com',
      invitationMessage: 'Hello there'
    }
  })
  const response = new MockExpressResponse()

  await SchoolInvite.send(request, response)

  t.is(400, response.statusCode, `Received ${response.statusCode} instead of 400`)
  t.deepEqual(response._getJSON(), { message: 'School not found' })
})

test.serial('Valid login, required data, valid school id, failed email', async (t) => {
  const request = new MockExpressRequest({
    method: 'POST',
    session: {
      isAuthenticated: true,
      me: {
        role: [Role.ADMIN]
      }
    },
    body: {
      schoolId: 1,
      inviteeName: 'Test Testington',
      inviteeEmail: 'test@example.com',
      invitationMessage: 'Hello there'
    }
  })
  const response = new MockExpressResponse()
  nodemailerMock.mock.setShouldFailOnce()

  await SchoolInvite.send(request, response)

  t.is(500, response.statusCode, `Received ${response.statusCode} instead of 500`)
  t.deepEqual(response._getJSON(), { message: 'Invitation email failed to send' })
})

test.serial('Valid login, required data, valid school id, sent email', async (t) => {
  const request = new MockExpressRequest({
    method: 'POST',
    session: {
      isAuthenticated: true,
      me: {
        role: [Role.ADMIN]
      }
    },
    body: {
      schoolId: 1,
      inviteeName: 'Test Testington',
      inviteeEmail: 'test@example.com',
      invitationMessage: 'Hello there'
    }
  })
  const response = new MockExpressResponse()

  await SchoolInvite.send(request, response)

  t.is(200, response.statusCode, `Received ${response.statusCode} instead of 200`)
  t.deepEqual(response._getJSON(), { message: 'Invitation email sent successfully' })

  const sentEmail = nodemailerMock.mock.getSentMail()
  t.is(sentEmail.length, 1)

  const email = sentEmail.pop()

  t.truthy(email.text.includes('Test Testington'), 'Name should be in message')
  t.truthy(email.text.includes('Hello there'), 'Invitation message should be in message')
  t.truthy(email.text.includes(fixtures.schools[0].name), 'School name should be in message')
})

test.serial('Create organisation from school', async (t) => {
  const schoolData = fixtures.schools[0]
  const organisation = await SchoolInvite.createOrganisationFromSchool(schoolData.schoolId)

  t.is(organisation.name, schoolData.name)
  t.is(organisation.contactName, schoolData.contactName)
  t.is(organisation.contactEmail, schoolData.contactEmail)
  t.is(organisation.contactPhoneNumber, schoolData.telephone)
  t.is(organisation.website, schoolData.website)
  t.is(organisation.address, schoolData.address)
  t.is(organisation.decile, schoolData.decile)

  // try a second time - should get the same organisation back.
  const org2 = await SchoolInvite.createOrganisationFromSchool(schoolData.schoolId)
  t.deepEqual(organisation._id, org2._id)
})

test.serial('Create organisation from non-existent school', async (t) => {
  const nonExistentSchoolId = 9999

  await t.throwsAsync(
    async () => {
      await SchoolInvite.createOrganisationFromSchool(nonExistentSchoolId)
    }, null,
    'School not found'
  )
})

test.serial('Link person to organisation as admin', async (t) => {
  t.plan(6)
  const schoolData = fixtures.schools[0]
  const organisation = await SchoolInvite.createOrganisationFromSchool(schoolData.schoolId)
  const person = await Person.findOne()
  const done = new Promise((resolve, reject) => {
    PubSub.subscribe(TOPIC_MEMBER__UPDATE, async (msg, member) => {
      t.is(member.status, MemberStatus.ORGADMIN)
      resolve(true)
    })
  })
  const member = await SchoolInvite.linkPersonToOrganisationAsAdmin(organisation._id, person._id)

  t.is(member.organisation._id.toString(), organisation._id.toString())
  t.is(member.person._id.toString(), person._id.toString())
  t.is(member.validation, 'orgAdmin from school-invite controller')
  t.is(member.status, MemberStatus.ORGADMIN)
  await done

  // check second record is not created.
  const dupMember = await SchoolInvite.linkPersonToOrganisationAsAdmin(organisation._id, person._id)
  t.deepEqual(member._id, dupMember._id)
})
