import test from 'ava'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import { SchoolInvite } from '../school-invite.controller'
import { Role } from '../../../services/authorize/role'
import MemoryMongo from '../../../util/test-memory-mongo'
import schoolLookUpFixtures from '../../school-lookup/__tests__/school-lookup.fixture'
import SchoolLookUp from '../../school-lookup/school-lookup'
import nodemailerMock from 'nodemailer-mock'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await SchoolLookUp.create(schoolLookUpFixtures)
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

test('Valid login, required data, valid school id, failed email', async (t) => {
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

  t.is(500, response.statusCode, `Received ${response.statusCode} instead of 200`)
  t.deepEqual(response._getJSON(), { message: 'Invitation email failed to send' })
})

test('Valid login, required data, valid school id, sent email', async (t) => {
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
  t.truthy(email.text.includes(schoolLookUpFixtures[0].name), 'School name should be in message')
})
