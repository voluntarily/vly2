import test from 'ava'
import { appReady } from '../../../server/server'
import MemoryMongo from '../../../server/util/test-memory-mongo'
import { getPersonFromUser, parseTokenToSession, parseUserToSession, createPersonFromUser, getUserFromServerCookie } from '../auth'
import jwtDecode from 'jwt-decode'
import fetchMock from 'fetch-mock'
import { API_URL } from '../../../lib/apiCaller'
import people from '../../../server/api/person/__tests__/person.fixture'
import { jwtData } from '../../../server/middleware/session/__tests__/setSession.fixture'
import Person from '../../../server/api/person/person'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
  await Person.create(people).catch((err) => `Unable to create people: ${err}`)
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.serial('create person from user when person doesnt exist', async t => {
  fetchMock.post(`${API_URL}/people`, people[0])
  const user = jwtDecode(jwtData.idToken)
  const person = await createPersonFromUser(user)
  t.is(person.email, user.email)
  fetchMock.restore()
})

test.serial('dont create person from user when person exists', async t => {
  fetchMock.post(`${API_URL}/people`, 409)
  const user = jwtDecode(jwtData.idToken)
  const person = await createPersonFromUser(user)
  t.false(person)
  fetchMock.restore()
})

test.serial('convert user to person when person exists', async t => {
  fetchMock.get(`${API_URL}/person/by/email/${jwtData.idTokenPayload.email}`, people[0])
  const user = jwtDecode(jwtData.idToken)
  const person = await getPersonFromUser(user)
  t.is(person.email, jwtData.idTokenPayload.email)
  fetchMock.restore()
})

test.serial('convert user to person when person does not exist', async t => {
  t.plan(2)
  fetchMock.get(`${API_URL}/person/by/email/${jwtData.idTokenPayload.email}`, 404)
  fetchMock.post(`${API_URL}/people`, people[0])
  const user = jwtDecode(jwtData.idToken)
  const person = await getPersonFromUser(user)
  t.is(person.email, jwtData.idTokenPayload.email)
  t.truthy(fetchMock.done())
  fetchMock.restore()
})

// test.serial('dont convert user to person when user email not verified', async t => {
//   const user = jwtDecode(jwtData.idToken)
//   user.email_verified = false
//   const person = await getPersonFromUser(user)
//   t.false(person)
// })

test.serial('convert token to session when person exists', async t => {
  t.plan(3)
  fetchMock.get(`${API_URL}/person/by/email/${jwtData.idTokenPayload.email}`, people[0])
  const session = await parseTokenToSession(jwtData.idToken)
  const user = jwtDecode(jwtData.idToken)
  t.true(session.isAuthenticated)
  t.deepEqual(session.me, people[0])
  t.deepEqual(session.user, user)
  fetchMock.restore()
})

test.serial('convert token to session when person does not exist', async t => {
  t.plan(4)
  fetchMock.get(`${API_URL}/person/by/email/${jwtData.idTokenPayload.email}`, 404)
  fetchMock.post(`${API_URL}/people`, people[0])
  const session = await parseTokenToSession(jwtData.idToken)
  const user = jwtDecode(jwtData.idToken)
  t.true(session.isAuthenticated)
  t.deepEqual(session.me, people[0])
  t.deepEqual(session.user, user)
  t.truthy(fetchMock.done())
  fetchMock.restore()
})

test.serial('convert user to session when person exists', async t => {
  t.plan(3)
  fetchMock.get(`${API_URL}/person/by/email/${jwtData.idTokenPayload.email}`, people[0])
  const user = jwtDecode(jwtData.idToken)
  const session = await parseUserToSession(user)
  t.true(session.isAuthenticated)
  t.is(session.me.email, people[0].email)
  t.is(session.user, user)
  fetchMock.restore()
})

test.serial('convert user to session when person does not exist', async t => {
  t.plan(4)
  fetchMock.get(`${API_URL}/person/by/email/${jwtData.idTokenPayload.email}`, 404)
  fetchMock.post(`${API_URL}/people`, people[0])
  const user = jwtDecode(jwtData.idToken)
  const session = await parseUserToSession(user)
  t.true(session.isAuthenticated)
  t.is(session.me.email, people[0].email)
  t.is(session.user, user)
  t.truthy(fetchMock.done())
  fetchMock.restore()
})

test.serial('get server cookie', async t => {
  // no cookies
  const req = {
    headers: {
      hi: 'hello'
    }
  }
  const udef = getUserFromServerCookie(req)
  t.is(udef, undefined)

  req.headers.cookie = 'one=1;two=2'
  const cookie = getUserFromServerCookie(req)
  t.is(cookie, undefined)

  req.headers.cookie = `idToken=${jwtData.idToken}`
  const jwtCookie = getUserFromServerCookie(req)
  t.is(jwtCookie.nickname, 'avowkind')
})
