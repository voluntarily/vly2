import test from 'ava'
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
  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()
  mockReq.session = {
    isAuthenticated: false,
    me: {},
    user: {}
  }
  await issueNewBadge(mockReq, mockRes)

  const expectedStatusCode = 403
  t.assert(expectedStatusCode === mockRes.statusCode, 'Status code should be 403 forbiden')
})
