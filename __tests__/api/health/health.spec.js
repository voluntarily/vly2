import test from 'ava'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import health from '../../../pages/api/health/health'
import param from '../../../pages/api/health/[healthQuery]'
import log from '../../../pages/api/health/log'
import pub from '../../../pages/api/health/pub'
import config from '../../../pages/api/health/config'
import sinon from 'sinon'
import { TOPIC_API__HEALTH } from '../../../server/services/pubsub/topic.constants'
import PubSub from 'pubsub-js'

test('Should respond to health check', async t => {
  const req = new MockExpressRequest()
  const res = new MockExpressResponse()

  req.query = { msg: 'Test' }
  await health(req, res)
  t.deepEqual(res._getJSON().query, { msg: 'Test' })
  t.is(200, res.statusCode, 'OK Response')
})

test('Should respond to parameter check', async t => {
  const req = new MockExpressRequest()
  const res = new MockExpressResponse()

  req.query = { healthQuery: 'Test' }
  await param(req, res)
  t.deepEqual(res._getJSON().query, { healthQuery: 'Test' })
  t.is(200, res.statusCode, 'OK Response')
})

test('Should prevent config check for non admins', async t => {
  const req = new MockExpressRequest()
  const res = new MockExpressResponse()
  req.ability = { can: sinon.fake.returns(false) }
  req.query = { param: 'Test' }
  await config(req, res)
  t.is(401, res.statusCode, 'Not allowed by CASL')
})

test('Should respond to config check', async t => {
  const req = new MockExpressRequest()
  const res = new MockExpressResponse()
  req.ability = { can: sinon.fake.returns(true) }
  req.query = { param: 'Test' }
  await config(req, res)
  t.is(200, res.statusCode, 'OK Response')
  t.deepEqual(res._getJSON().env, 'test')
})

test('Should respond to log check', async t => {
  const req = new MockExpressRequest()
  const res = new MockExpressResponse()
  req.query = { msg: 'Log Test' }
  await log(req, res)
  t.deepEqual(res._getJSON(), 'Log Test')
  t.is(200, res.statusCode, 'OK Response')
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

  const req = new MockExpressRequest()
  const res = new MockExpressResponse()
  req.query = { msg: 'Pub Test' }
  await pub(req, res)

  t.is(spy.callCount, 0)
  clock.tick(1)
  t.is(spy.callCount, 1)
  clock.restore()
  t.deepEqual(spy.args[0][1], { msg: 'Pub Test' })
  t.deepEqual(res._getJSON(), 'Pub Test')
  t.is(200, res.statusCode, 'OK Response')
})

// req.session = {
//   isAuthenticated: false,
//   me: {},
//   user: {}
// }
