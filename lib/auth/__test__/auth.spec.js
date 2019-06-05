import test from 'ava'
import { appReady } from '../../../server/server'
import Person from '../../../server/api/person/person'
import MemoryMongo from '../../../server/util/test-memory-mongo'
import { getPersonFromUser, parseTokenToSession, parseUserToSession, createPersonFromUser } from '../auth'
import jwtDecode from 'jwt-decode'
import fetchMock from 'fetch-mock'
import { API_URL } from '../../../lib/apiCaller'
// import { createStore, combineReducers, applyMiddleware } from 'redux'
// import { Provider } from 'react-redux'
// import thunk from 'redux-thunk'

// const initUser = {

// }

// const reducers = combineReducers({
//   user: HealthReducer,
//   rst: ReduxStoreTestReducer
// })

// const initStore = {
//   health: initHealth,
//   rst: { name: 'World' }
// }
// const realStore = createStore(reducers, initStore, applyMiddleware(thunk))

// Initial people added into test db
const people = [
  {
    name: 'ANDREW WATKINS',
    nickname: 'Andrew',
    email: 'andrew@groat.nz',
    phone: '027 7031007',
    role: ['tester', 'admin', 'vp']
  },
  {
    name: 'WALTER LIM',
    nickname: 'Walt',
    phone: '027 7031007',
    email: 'walter@omgtech.co.nz',
    role: ['tester']
  }
]

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add two person entries', async () => {
  // console.log('creating people')
  await Person.create(people).catch(() => 'Unable to create people')
  // console.log('creating people done')
})

test.afterEach.always(async () => {
  await Person.deleteMany()
})

const jwtData = {
  accessToken: 'IGs4bjO5WLjsulmjKiW2-VLeetlgykUP',
  idToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik56VkZSamN4TVRVMVJEQTRPRE5DTjBVeFFVVXdORFEwUkRJMU4wTTNOa1k0TkRZeU56RkRRUSJ9.eyJuaWNrbmFtZSI6ImF2b3draW5kIiwibmFtZSI6IkFuZHJldyBXYXRraW5zIiwicGljdHVyZSI6Imh0dHBzOi8vYXZhdGFyczIuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTU5NjQzNz92PTQiLCJ1cGRhdGVkX2F0IjoiMjAxOS0wNS0yM1QyMzoxNTo0Ni4zNjBaIiwiZW1haWwiOiJhbmRyZXdAZ3JvYXQubnoiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9kZXYteDZrLXAxNWwuYXUuYXV0aDAuY29tLyIsInN1YiI6ImdpdGh1YnwxNTk2NDM3IiwiYXVkIjoiVHNSUFRWSU5aVk9kYW8yTGY3RVU4c1BEa1ZaM1ZRSlkiLCJpYXQiOjE1NTg2NTMzNDYsImV4cCI6MTU1ODY4OTM0NiwiYXRfaGFzaCI6Im5kd0M0R1JlLUxybFZKN0xTX1NkQWciLCJub25jZSI6ImF1d3ZvT3NKNmVwTlRYa2ZLdV9idGNyLm1veDJhZnFRIn0.PylkppNXr1MRypritpCjGKlQa4P81DxDBJAd3GjDMpuDkCaC-Nz2s-U-AuqSSGiu4mHuFhr5GzEX1UzaYBpZPPKVyZ-h1TX4C3guvwIIgdAMbg_UizscKyJvnEpbFrHwp8P1g6wD8GUCMwSkFyCQKhs44I5J9Ca_twwdx2hyOLeUmysrTzQfywZxWJyHlmHEsF0DNzHc8YP8o5JmnTRhUMEy1fmsGYNhfYQcJIw7Jk9QrGM6OEQhKtBahetxHfhRWNvBWNDKAcBNY76JulZybJbx9S8pnrsMVD4NMA-AS238lFY-7Azn1R-8s4nhT2y6hL97FMhf2-NTc1fEOeajbg',
  idTokenPayload: {
    at_hash: 'ndwC4GRe-LrlVJ7LS_SdAg',
    aud: 'TsRPTVINZVOdao2Lf7EU8sPDkVZ3VQJY',
    email: 'andrew@groat.nz',
    email_verified: true,
    exp: 1558689346,
    iat: 1558653346,
    iss: 'https://dev-x6k-p15l.au.auth0.com/',
    name: 'Andrew Watkins',
    nickname: 'avowkind',
    nonce: 'auwvoOsJ6epNTXkfKu_btcr.mox2afqQ',
    picture: 'https://avatars2.githubusercontent.com/u/1596437?v=4',
    sub: 'github|1596437',
    updated_at: '2019-05-23T23:15:46.360Z',
    appState: null
  },
  refreshToken: null,
  state: 'Nz_CgRTnYPO5CbD4ueKmkdCiuk2z3psk',
  expiresIn: 7200,
  tokenType: 'Bearer',
  scope: null
}

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

test.serial('dont convert user to person when user email not verified', async t => {
  const user = jwtDecode(jwtData.idToken)
  user.email_verified = false
  const person = await getPersonFromUser(user)
  t.false(person)
})

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
