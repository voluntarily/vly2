import test from 'ava'
import setSession from '../setSession'
import { appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import Person from '../../../api/person/person'
import people from '../../../api/person/__tests__/person.fixture'
import { jwtData, DEFAULT_SESSION } from './setSession.fixture'
import sinon from 'sinon'
import jwt from 'jsonwebtoken'

test.before('before connect to database', async (t) => {
  try {
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
    await Person.create(people).catch((err) => `Unable to create people: ${err}`)
    await appReady
  } catch (e) { console.error('setSession.spec.js test.before error:', e) }
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test('check fixture token', t => {
  const decoded = jwt.verify(jwtData.idToken, 'secret')
  t.is(decoded.email, 'andrew@groat.nz') // bar
})
test('Check session set to default when user not logged in', async t => {
  const next = sinon.spy()
  const req = { url: '/api/foo', cookies: {}, headers: { cookie: null } }
  await setSession(req, null, next)
  t.deepEqual(req.session, DEFAULT_SESSION)
  t.truthy(next.calledOnce)
})

test('Check session set to default when idToken is bad', async t => {
  const next = sinon.spy()
  const errlog = console.error
  console.error = sinon.spy()

  const req = { url: '/api/foo', cookies: { idToken: 'foo' } }
  await setSession(req, null, next)
  t.deepEqual(req.session, DEFAULT_SESSION)
  t.truthy(next.calledOnce)
  t.truthy(console.error.calledOnce)
  console.error = errlog
})

test('Check session set to default when url is blacklisted', async t => {
  const next = sinon.spy()
  const req = { url: '/static/someimage.jpg', cookies: { idToken: jwtData.idToken } }
  await setSession(req, null, next)
  t.deepEqual(req.session, DEFAULT_SESSION)
  t.truthy(next.calledOnce)
})

test('Check session set when user logged in', async t => {
  const next = sinon.spy()
  const req = { url: '/api/foo', cookies: { idToken: jwtData.idToken } }
  await setSession(req, null, next)
  t.true(req.session.isAuthenticated)
  t.is(req.session.user.email, jwtData.idTokenPayload.email)
  t.is(req.session.me.email, jwtData.idTokenPayload.email)
  t.truthy(next.calledOnce)
})
