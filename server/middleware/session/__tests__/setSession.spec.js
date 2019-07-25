import test from 'ava'
import setSession from '../setSession'
import { appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import Person from '../../../api/person/person'
import people from '../../../api/person/__tests__/person.fixture'
import { jwtData, DEFAULT_SESSION } from './setSession.fixture'

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add peopl fixture', async () => {
  await Person.create(people).catch((err) => `Unable to create people: ${err}`)
})

test.serial('Check session set to default when user not logged in', async t => {
  const req = { url: '/api/foo', cookies: {}, headers: { cookie: null } }
  await setSession(req, null, () => { })
  t.deepEqual(req.session, DEFAULT_SESSION)
})

test.serial('Check session set to default when idToken is bad', async t => {
  const req = { url: '/api/foo', cookies: { idToken: 'foo' } }
  await setSession(req, null, () => { })
  t.deepEqual(req.session, DEFAULT_SESSION)
})

test.serial('Check session set to default when url is blacklisted', async t => {
  const req = { url: '/static/someimage.jpg', cookies: { idToken: jwtData.idToken } }
  await setSession(req, null, () => { })
  t.deepEqual(req.session, DEFAULT_SESSION)
})

test.serial('Check session set when user logged in', async t => {
  const req = { url: '/api/foo', cookies: { idToken: jwtData.idToken } }
  await setSession(req, null, () => { })
  t.true(req.session.isAuthenticated)
  t.is(req.session.user.email, jwtData.idTokenPayload.email)
  t.is(req.session.me.email, jwtData.idTokenPayload.email)
})
