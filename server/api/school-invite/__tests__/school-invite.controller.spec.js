import test from 'ava'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import { SchoolInvite } from '../school-invite.controller'
import { Role } from '../../../services/authorize/role'
import MemoryMongo from '../../../util/test-memory-mongo'
import SchoolLookUp from '../../school-lookup/school-lookup'
import nodemailerMock from 'nodemailer-mock'
import fixtures from './school-invite.fixture'
import Person from '../../person/person'
import { MemberStatus } from '../../member/member.constants'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await SchoolLookUp.create(fixtures.schools)
  await Person.create(fixtures.people)
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test('Invalid HTTP methods', async (t) => {
  for (const method of ['GET', 'PUT', 'DELETE']) {
    const request = new MockExpressRequest({ method })
    const response = new MockExpressResponse()

    await SchoolInvite.send(request, response)

    t.is(404, response.statusCode, `${method} requests should result in 404`)
  }
})

test('Not logged in', async (t) => {
  const request = new MockExpressRequest({ method: 'POST' })
  const response = new MockExpressResponse()

  await SchoolInvite.send(request, response)

  t.is(403, response.statusCode, `Received ${response.statusCode} instead of 403`)
})

test('Valid login, missing body', async (t) => {
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

test('Valid login, missing required data', async (t) => {
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

test('Valid login, required data, invalid school id', async (t) => {
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

test('Create organisation from school', async (t) => {
  const schoolData = fixtures.schools[0]
  const organisation = await SchoolInvite.createOrganisationFromSchool(schoolData.schoolId)

  t.is(organisation.name, schoolData.name)
  t.is(organisation.contactName, schoolData.contactName)
  t.is(organisation.contactEmail, schoolData.contactEmail)
  t.is(organisation.contactPhoneNumber, schoolData.telephone)
  t.is(organisation.website, schoolData.website)
  t.is(organisation.address, schoolData.address)
  t.is(organisation.decile, schoolData.decile)
})

test('Create organisation from non-existent school', async (t) => {
  const nonExistentSchoolId = 9999

  await t.throwsAsync(
    async () => {
      await SchoolInvite.createOrganisationFromSchool(nonExistentSchoolId)
    },
    'School not found'
  )
})

test('Link person to organisation as admin', async (t) => {
  const schoolData = fixtures.schools[0]
  const organisation = await SchoolInvite.createOrganisationFromSchool(schoolData.schoolId)
  const person = await Person.findOne()

  const member = await SchoolInvite.linkPersonToOrganisationAsAdmin(organisation._id, person._id)

  t.is(member.organisation, organisation._id)
  t.is(member.person, person._id)
  t.is(member.validation, 'orgAdmin from school-invite controller')
  t.is(member.status, MemberStatus.ORGADMIN)
})
