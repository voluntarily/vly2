import test from 'ava'
import MemoryMongo from '../../../util/test-memory-mongo'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import { getSummary, getLocations } from '../statistics.controller'
import {
  firstOrgId,
  organisations,
  people,
  members,
  archivedOpportunities,
  interestArchives
} from './statistics.fixture'
import { Role } from '../../../services/authorize/role'
const { InterestArchive } = require('../../interest/interest')
const Member = require('../../member/member')
const ArchivedOpportunity = require('../../archivedOpportunity/archivedOpportunity')
const Organisation = require('../../organisation/organisation')
const Person = require('../../person/person')

test.before('Create a mock database and populate it with data ', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()

  await Organisation.create(organisations)
  await Person.create(people)
  await Member.create(members)
  await ArchivedOpportunity.create(archivedOpportunities)
  await InterestArchive.create(interestArchives)
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test(
  'Test getSummary returns correct volunteers and hours',
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'year' }
    mockReq.session = {
      isAuthenticated: true,
      me: { role: [Role.ORG_ADMIN], orgAdminFor: [firstOrgId] },
      user: {}
    }

    await getSummary(mockReq, mockRes)
    const responseData = mockRes._getJSON()
    const expectedStatusCode = 200

    const expectedData = {
      avgHoursPerVolunteer: 2.9583333333333335,
      totalHours: 5.916666666666667,
      totalVolunteers: 2
    }

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 200 OK'
    )
    t.deepEqual(responseData, expectedData)
  }
)

test(
  "Test getSummary returns error when organisation doesn't exist",
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    const nonExistentOrgId = '5e73112a7f283c001151efc2'

    mockReq.params = { orgId: nonExistentOrgId, timeframe: 'year' }
    mockReq.session = {
      isAuthenticated: true,
      me: { role: [Role.ORG_ADMIN], orgAdminFor: [nonExistentOrgId] },
      user: {}
    }

    await getSummary(mockReq, mockRes)
    const expectedStatusCode = 404

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 404 NOT FOUND'
    )
  }
)

test(
  "Test getSummary returns error when timeframe doesn't exist",
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'jerry' }
    mockReq.session = {
      isAuthenticated: true,
      me: { role: [Role.ORG_ADMIN], orgAdminFor: [firstOrgId] },
      user: {}
    }

    await getSummary(mockReq, mockRes)
    const expectedStatusCode = 400

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 400 NOT FOUND'
    )
  }
)

test(
  'Test getSummary returns error when user is not authenticated',
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'year' }
    mockReq.session = {}

    await getSummary(mockReq, mockRes)
    const expectedStatusCode = 401

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 401 UNAUTHORIZED'
    )
  }
)

test(
  'Test getSummary returns error when user is not an organisation administrator',
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'year' }
    mockReq.session = {
      isAuthenticated: true,
      me: { role: [Role.VOLUNTEER] },
      user: {}
    }

    await getSummary(mockReq, mockRes)
    const expectedStatusCode = 403

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 403 FORBIDDEN'
    )
  }
)

test(
  'Test getSummary returns error when user is not an organisation administrator associated with the dashboard requested',
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'year' }
    mockReq.session = {
      isAuthenticated: true,
      me: { role: [Role.VOLUNTEER], orgAdminFor: ['some other organisation id'] },
      user: {}
    }

    await getSummary(mockReq, mockRes)
    const expectedStatusCode = 403

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 403 FORBIDDEN'
    )
  }
)

test(
  'Test getLocations returns correct locations and counts',
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'year' }
    mockReq.session = {
      isAuthenticated: true,
      me: { role: [Role.ORG_ADMIN], orgAdminFor: [firstOrgId] },
      user: {}
    }

    await getLocations(mockReq, mockRes)
    const responseData = mockRes._getJSON()
    const expectedStatusCode = 200

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 200 OK'
    )
    t.assert(Array.isArray(responseData), 'response should be an array')
    t.assert(responseData.find(e => e.name === 'auckland').value === 2, 'incorrect location count for auckland')
    t.assert(responseData.find(e => e.name === 'wellington').value === 1, 'incorrect location count for wellington')
    t.assert(responseData.find(e => e.name === 'online').value === 1, 'incorrect location count for online')
  }
)

test(
  "Test getLocations returns error when organisation doesn't exist",
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    const nonExistentOrgId = '5e73112a7f283c001151efc2'

    mockReq.params = { orgId: nonExistentOrgId, timeframe: 'year' }
    mockReq.session = {
      isAuthenticated: true,
      me: { role: [Role.ORG_ADMIN], orgAdminFor: [nonExistentOrgId] },
      user: {}
    }

    await getLocations(mockReq, mockRes)
    const expectedStatusCode = 404

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 404 NOT FOUND'
    )
  }
)

test(
  "Test getLocations returns error when timeframe doesn't exist",
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'jerry' }
    mockReq.session = {
      isAuthenticated: true,
      me: { role: [Role.ORG_ADMIN], orgAdminFor: [firstOrgId] },
      user: {}
    }

    await getLocations(mockReq, mockRes)
    const expectedStatusCode = 400

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 400 NOT FOUND'
    )
  }
)

test(
  'Test getLocations returns error when user is not authenticated',
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'year' }
    mockReq.session = {}

    await getLocations(mockReq, mockRes)
    const expectedStatusCode = 401

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 401 UNAUTHORIZED'
    )
  }
)

test(
  'Test getLocations returns error when user is not an organisation administrator',
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'year' }
    mockReq.session = {
      isAuthenticated: true,
      me: { role: [Role.VOLUNTEER] },
      user: {}
    }

    await getLocations(mockReq, mockRes)
    const expectedStatusCode = 403

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 403 FORBIDDEN'
    )
  }
)

test(
  'Test getLocations returns error when user is not an organisation administrator associated with the dashboard requested',
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'year' }
    mockReq.session = {
      isAuthenticated: true,
      me: { role: [Role.VOLUNTEER], orgAdminFor: ['some other organisation id'] },
      user: {}
    }

    await getLocations(mockReq, mockRes)
    const expectedStatusCode = 403

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 403 FORBIDDEN'
    )
  }
)
