import test from 'ava'
import { fetchMock } from 'fetch-mock'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import { issueNewBadge } from '../badge.controller'

const expectedBadgeResult = {
  'entityType': 'Assertion',
  'entityId': 'WDVAtNTfT_S8JuO-u8rVEw',
  'openBadgeId': 'https://api.badgr.io/public/assertions/WDVAtNTfT_S8JuO-u8rVEw',
  'createdAt': '2019-09-12T04:33:37.129885Z',
  'createdBy': 'ZR_9B1v2S2OHJ9UoFIs5vw',
  'badgeclass': 'HhIer_mgTtahY6TRT22L5A',
  'badgeclassOpenBadgeId': 'https://api.badgr.io/public/badges/HhIer_mgTtahY6TRT22L5A',
  'issuer': 'aSBVfm84SMiF0c16O9jCOA',
  'issuerOpenBadgeId': 'https://api.badgr.io/public/issuers/aSBVfm84SMiF0c16O9jCOA',
  'image': 'https://media.badgr.io/uploads/badges/assertion-WDVAtNTfT_S8JuO-u8rVEw.png',
  'recipient': {
    'identity': 'sha256$cc37fd25e8687b0c8adbd743f7e43997a0d5eb279b5eea11b7d5787f7b0f5842',
    'hashed': true,
    'type': 'email',
    'plaintextIdentity': 'andrew@omgtech.co.nz',
    'salt': 'dc5af5ab2e8e456daaf80b5352741a82'
  },
  'issuedOn': '2019-09-12T04:33:36.761207Z',
  'narrative': null,
  'evidence': [],
  'revoked': false,
  'revocationReason': null,
  'expires': null,
  'extensions': {}
}

test.serial('Test request issue badge return information about badge', async t => {
  let mockFetch = fetchMock.sandbox()
    .get('*', 200)
    .post('begin:https://api.badgr.io/o/token', {
      body: {
        access_token: 'asodjhfsiuh'
      }
    })
    .post('begin:https://api.badgr.io/v2/badgeclasses', {
      body: {
        result: expectedBadgeResult
      }
    })
  global.fetch = mockFetch

  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()
  mockReq.session = {
    isAuthenticated: false,
    me: {},
    user: {}
  }
  mockReq.body = {
    email: 'Testing@gmail.com',
    _id: 'Anothertest'
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
