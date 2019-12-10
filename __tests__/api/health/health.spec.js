import test from 'ava'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import health from '../../../pages/api/health/health'
import param from '../../../pages/api/health/[param]'
import log from '../../../pages/api/health/log'
import pub from '../../../pages/api/health/pub'
import sinon from 'sinon'
import { TOPIC_API__HEALTH } from '../../../server/services/pubsub/topic.constants'
import PubSub from 'pubsub-js'

test('Should respond to health check', async t => {
  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()

  mockReq.query = { msg: 'Test' }
  await health(mockReq, mockRes)
  t.deepEqual(mockRes._getJSON().query, { msg: 'Test' })
  t.is(200, mockRes.statusCode, 'OK Response')
})

test('Should respond to parameter check', async t => {
  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()

  mockReq.query = { param: 'Test' }
  await param(mockReq, mockRes)
  t.deepEqual(mockRes._getJSON().query, { param: 'Test' })
  t.is(200, mockRes.statusCode, 'OK Response')
})

test('Should respond to log check', async t => {
  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()
  mockReq.query = { msg: 'Log Test' }
  await log(mockReq, mockRes)
  t.deepEqual(mockRes._getJSON(), 'Log Test')
  t.is(200, mockRes.statusCode, 'OK Response')
})

/* Example of testing Pub/Sub calls
  The api handler will publish a TOPIC_API__HEALTH message
  this doesn't usually have a handler so has no side effects
  the test subscribes to the topic and calls a spy.
  We validate that the spy gets called once the pub is called
  we use sinon fake timers to allow the async to transact.
  */
test('Should respond to pub check', async t => {
  const spy = sinon.spy()
  const clock = sinon.useFakeTimers()

  PubSub.subscribe(TOPIC_API__HEALTH, spy)

  const mockReq = new MockExpressRequest()
  const mockRes = new MockExpressResponse()
  mockReq.query = { msg: 'Pub Test' }
  await pub(mockReq, mockRes)

  t.is(spy.callCount, 0)
  clock.tick(1)
  t.is(spy.callCount, 1)
  clock.restore()
  t.deepEqual(spy.args[0][1], { msg: 'Pub Test' })
  t.deepEqual(mockRes._getJSON(), 'Pub Test')
  t.is(200, mockRes.statusCode, 'OK Response')
})

// mockReq.session = {
//   isAuthenticated: false,
//   me: {},
//   user: {}
// }
