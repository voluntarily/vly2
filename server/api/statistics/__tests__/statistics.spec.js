import test from 'ava'
import MemoryMongo from '../../../util/test-memory-mongo'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import { getSummary, getLocations, getActivityTags, getRatings } from '../statistics.controller'
import {
  firstOrgId,
  organisations,
  people,
  members,
  archivedOpportunities,
  interestArchives,
  activities,
  feedback
} from './statistics.fixture'
import { Role } from '../../../services/authorize/role'
const { InterestArchive } = require('../../interest/interest')
const Member = require('../../member/member')
const ArchivedOpportunity = require('../../archivedOpportunity/archivedOpportunity')
const Organisation = require('../../organisation/organisation')
const Person = require('../../person/person')
const { authoriseStatistics } = require('../statistics.middleware')
const Activity = require('../../activity/activity')
const Feedback = require('../../feedback/feedback')
const sinon = require('sinon')

test.before('Create a mock database and populate it with data ', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()

  await Organisation.create(organisations)
  await Person.create(people)
  await Member.create(members)
  await ArchivedOpportunity.create(archivedOpportunities)
  await InterestArchive.create(interestArchives)
  await Activity.create(activities)
  await Feedback.create(feedback)
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

    await getSummary(mockReq, mockRes)
    const expectedStatusCode = 400

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 400 NOT FOUND'
    )
  }
)

test(
  'Test getLocations returns correct locations and counts',
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'year' }

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

    await getLocations(mockReq, mockRes)
    const expectedStatusCode = 400

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 400 NOT FOUND'
    )
  }
)

test(
  'Test getActivityTags returns correct activity tags and counts',
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'year' }

    await getActivityTags(mockReq, mockRes)
    const responseData = mockRes._getJSON()
    const expectedStatusCode = 200

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 200 OK'
    )
    t.assert(Array.isArray(responseData), 'response should be an array')
    t.assert(responseData.find(e => e.name === 'react').value === 1, 'incorrect location activity tag count for react')
    t.assert(responseData.find(e => e.name === 'javascript').value === 0.75, 'incorrect activity tag count for javascript')
    t.assert(responseData.find(e => e.name === 'python').value === 0.75, 'incorrect activity tag count for python')
    t.assert(responseData.find(e => e.name === 'public speaking').value === 0.25, 'incorrect activity tag count for public speaking')
    t.assert(responseData.find(e => e.name === 'devops').value === 0.25, 'incorrect activity tag count for devops')
  }
)

test(
  "Test getActivityTags returns error when organisation doesn't exist",
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    const nonExistentOrgId = '5e73112a7f283c001151efc2'

    mockReq.params = { orgId: nonExistentOrgId, timeframe: 'year' }

    await getActivityTags(mockReq, mockRes)
    const expectedStatusCode = 404

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 404 NOT FOUND'
    )
  }
)

test(
  "Test getActivityTags returns error when timeframe doesn't exist",
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'jerry' }

    await getActivityTags(mockReq, mockRes)
    const expectedStatusCode = 400

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 400 NOT FOUND'
    )
  }
)

test(
  'Test getRatings returns correct ratings',
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'year' }

    await getRatings(mockReq, mockRes)
    const responseData = mockRes._getJSON()
    const expectedStatusCode = 200
    const expectedData = [{ name: 1, value: 2 }, { name: 2, value: 0 }, { name: 3, value: 0 }, { name: 4, value: 1 }, { name: 5, value: 0 }]

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 200 OK'
    )
    t.assert(Array.isArray(responseData), 'response should be an array')
    t.deepEqual(responseData, expectedData)
  }
)

test(
  "Test getRatings returns error when organisation doesn't exist",
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    const nonExistentOrgId = '5e73112a7f283c001151efc2'

    mockReq.params = { orgId: nonExistentOrgId, timeframe: 'year' }

    await getRatings(mockReq, mockRes)
    const expectedStatusCode = 404

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 404 NOT FOUND'
    )
  }
)

test(
  "Test getRatings returns error when timeframe doesn't exist",
  async (t) => {
    const mockReq = new MockExpressRequest()
    const mockRes = new MockExpressResponse()

    mockReq.params = { orgId: firstOrgId, timeframe: 'jerry' }

    await getRatings(mockReq, mockRes)
    const expectedStatusCode = 400

    t.assert(
      expectedStatusCode === mockRes.statusCode,
      'Status code should be 400 NOT FOUND'
    )
  }
)

test('Test statistics auth returns error when user is not authenticated', async (t) => {
  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()
  const mockNext = sinon.spy()

  mockReq.params = { orgId: firstOrgId, timeframe: 'year' }
  mockReq.session = {}

  await authoriseStatistics(mockReq, mockRes, mockNext)
  const expectedStatusCode = 401

  t.assert(
    expectedStatusCode === mockRes.statusCode,
    'Status code should be 401 UNAUTHORIZED'
  )

  t.assert(mockNext.notCalled, 'Middleware chain should not be continued')
})

test('Test statistics auth returns error when user is not an organisation administrator', async (t) => {
  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()
  const mockNext = sinon.spy()

  mockReq.params = { orgId: firstOrgId, timeframe: 'year' }
  mockReq.session = {
    isAuthenticated: true,
    me: { role: [Role.VOLUNTEER] },
    user: {}
  }

  await authoriseStatistics(mockReq, mockRes, mockNext)
  const expectedStatusCode = 403

  t.assert(
    expectedStatusCode === mockRes.statusCode,
    'Status code should be 403 FORBIDDEN'
  )

  t.assert(mockNext.notCalled, 'Middleware chain should not be continued')
})

test('Test statistics auth returns error when user is not an organisation administrator associated with the dashboard requested', async (t) => {
  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()
  const mockNext = sinon.spy()

  mockReq.params = { orgId: firstOrgId, timeframe: 'year' }
  mockReq.session = {
    isAuthenticated: true,
    me: { role: [Role.VOLUNTEER], orgAdminFor: ['some other organisation id'] },
    user: {}
  }

  await authoriseStatistics(mockReq, mockRes, mockNext)
  const expectedStatusCode = 403

  t.assert(
    expectedStatusCode === mockRes.statusCode,
    'Status code should be 403 FORBIDDEN'
  )

  t.assert(mockNext.notCalled, 'Middleware chain should not be continued')
})

test('Test statistics auth continues middleware when user is authorised', async (t) => {
  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()
  const mockNext = sinon.spy()

  mockReq.params = { orgId: firstOrgId, timeframe: 'year' }
  mockReq.session = {
    isAuthenticated: true,
    me: { role: [Role.ORG_ADMIN], orgAdminFor: [firstOrgId] },
    user: {}
  }

  await authoriseStatistics(mockReq, mockRes, mockNext)

  t.assert(mockNext.calledOnce, 'Middleware chain should be continued')
})
