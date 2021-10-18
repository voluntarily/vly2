import test from 'ava'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import { issueNewBadge, listAllBadge } from '../badge.controller'
import { config } from '../../../../config/serverConfig'
import Badge from '../badge'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import badges from './badges.fixture'
import fetchMock from 'fetch-mock'
const { BADGR_API } = config

const expectedBadgeResult = [{
  entityType: 'Assertion',
  entityId: 'WDVAtNTfT_S8JuO-u8rVEw',
  openBadgeId: `${BADGR_API}/public/assertions/WDVAtNTfT_S8JuO-u8rVEw`,
  createdAt: '2019-09-12T04:33:37.129885Z',
  createdBy: 'ZR_9B1v2S2OHJ9UoFIs5vw',
  badgeclass: 'HhIer_mgTtahY6TRT22L5A',
  badgeclassOpenBadgeId: `${BADGR_API}/public/badges/HhIer_mgTtahY6TRT22L5A`,
  issuer: 'aSBVfm84SMiF0c16O9jCOA',
  issuerOpenBadgeId: `${BADGR_API}/public/issuers/aSBVfm84SMiF0c16O9jCOA`,
  image: 'https://media.badgr.io/uploads/badges/assertion-WDVAtNTfT_S8JuO-u8rVEw.png',
  recipient: {
    identity: 'sha256$cc37fd25e8687b0c8adbd743f7e43997a0d5eb279b5eea11b7d5787f7b0f5842',
    hashed: true,
    type: 'email',
    plaintextIdentity: 'andrew@omgtech.co.nz',
    salt: 'dc5af5ab2e8e456daaf80b5352741a82'
  },
  issuedOn: '2019-09-12T04:33:36.761207Z',
  narrative: null,
  evidence: [],
  revoked: false,
  revocationReason: null,
  expires: null,
  extensions: {}
}]

test.before('before connect to database', startMongo)
test.after.always(stopMongo)

test.beforeEach('connect and add people fixture', async () => {
  await Person.create(people).catch((err) => `Unable to create people: ${err}`)
})

test.afterEach.always(async () => {
  await Badge.deleteMany()
  await Person.deleteMany()
})

test.serial('Test request issue badge return information about badge', async t => {
  const mockFetch = fetchMock.sandbox()
    .get('*', 200)
    .post(`begin:${BADGR_API}/o/token`, {
      body: {
        access_token: 'asodjhfsiuh'
      }
    })
    .post(`begin:${BADGR_API}/v2/badgeclasses`, {
      body: {
        result: expectedBadgeResult
      }
    })
  global.fetch = mockFetch

  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()
  mockReq.session = {
    isAuthenticated: true,
    me: { role: ['admin'] },
    user: {}
  }
  const andrew = await Person.findOne({ email: 'andrew@groat.nz' })
  mockReq.body = {
    email: 'Testing@gmail.com',
    _id: `${andrew._id}`
  }
  mockReq.params = {
    badgeID: 'Maklsjdfad'
  }
  await issueNewBadge(mockReq, mockRes)
  const responseData = mockRes._getJSON()
  const expectedStatusCode = 200
  t.assert(expectedStatusCode === mockRes.statusCode, 'Status code should be 200 OK')
  t.deepEqual(responseData.result, expectedBadgeResult)
})

test.serial('Successfully query all badge available ', async t => {
  const { BADGR_API } = config
  const serverMock = fetchMock.sandbox()
    .get(`begin:${BADGR_API}/v2/badgeclasses`, {
      body: {
        result: badges
      }
    })
    .post(`begin:${BADGR_API}/o/token`, {
      body: {
        access_token: 'Dummy Token'
      }
    })
  global.fetch = serverMock

  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()

  await listAllBadge(mockReq, mockRes)

  const responseFromServer = mockRes._getJSON()
  t.deepEqual(badges, responseFromServer)
})

test.serial('Issue badge saved new badge record to database', async t => {
  const mockFetch = fetchMock.sandbox()
    .get('*', 200)
    .post(`begin:${BADGR_API}/o/token`, {
      body: {
        access_token: 'asodjhfsiuh'
      }
    })
    .post(`begin:${BADGR_API}/v2/badgeclasses`, {
      body: {
        result: expectedBadgeResult
      }
    })
  global.fetch = mockFetch

  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()
  mockReq.session = {
    isAuthenticated: true,
    me: { role: ['admin'] },
    user: {}
  }
  const andrew = await Person.findOne({ email: 'andrew@groat.nz' })
  mockReq.body = {
    email: 'Testing@gmail.com',
    _id: `${andrew._id}`
  }
  mockReq.params = {
    badgeID: 'Maklsjdfad'
  }
  await issueNewBadge(mockReq, mockRes)
  const noBadgeIssuedTotal = await Badge.countDocuments()
  t.is(noBadgeIssuedTotal, 1)
})
