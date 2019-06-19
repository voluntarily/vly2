import test from 'ava'
import setSession from '../setSession'
import { appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import Person from '../../../api/person/person'
import people from '../../../api/person/__tests__/person.fixture'

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

const DEFAULT_SESSION = {
  isAuthenticated: false,
  user: null,
  me: null
}

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
  const req = { cookies: { } }
  await setSession(req, null, () => {})
  t.deepEqual(req.session, DEFAULT_SESSION)
})

test.serial('Check session set to default when idToken is bad', async t => {
  const req = { cookies: { idToken: 'foo' } }
  await setSession(req, null, () => {})
  t.deepEqual(req.session, DEFAULT_SESSION)
})

test.serial('Check session set to default when url is blacklisted', async t => {
  const req = { url: '/static/someimage.jpg', cookies: { idToken: jwtData.idToken } }
  await setSession(req, null, () => {})
  t.deepEqual(req.session, DEFAULT_SESSION)
})

test.serial('Check session set when user logged in', async t => {
  const req = { cookies: { idToken: jwtData.idToken } }
  await setSession(req, null, () => {})
  t.true(req.session.isAuthenticated)
  t.is(req.session.user.email, jwtData.idTokenPayload.email)
  t.is(req.session.me.email, jwtData.idTokenPayload.email)
})
