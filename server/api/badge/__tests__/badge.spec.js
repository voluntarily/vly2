import test from 'ava'
require('isomorphic-fetch')
import fetchMock from 'fetch-mock'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import { issueNewBadge } from '../badge.controller'

test.failing('Test if receive token from Badgr', async t => {
  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()
  await issueNewBadge(mockReq, mockRes)

  const expectedStatusCode = 200
  const { statusCode: actualStatusCode } = mockRes
  t.assert(expectedStatusCode === actualStatusCode)
})

test.serial('Test request is not allowed to issue badge', async t => {
  fetchMock.sandbox()
    .mock('glob:https://api.badgr.io/**', 200)
    .post('*', { access_token: 'DUMY' })
  global.fetch = fetchMock

  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()
  mockReq.session = {
    isAuthenticated: false,
    me: {},
    user: {}
  }
  mockReq.params = {
    badgeID: 'Maklsjdfad'
  }
  await issueNewBadge(mockReq, mockRes)

  const expectedStatusCode = 403
  t.assert(expectedStatusCode === mockRes.statusCode, 'Status code should be 403 forbiden')
})
