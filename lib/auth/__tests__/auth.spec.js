import test from 'ava'
import jwtDecode from 'jwt-decode'
import Person from '../../../server/api/person/person'
import people from '../../../server/api/person/__tests__/person.fixture'
import { jwtData } from '../../../server/middleware/session/__tests__/setSession.fixture'
import MemoryMongo from '../../../server/util/test-memory-mongo'
import { createPersonFromUser, getPersonFromUser, parseTokenToSession } from '../auth'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await Person.create(people).catch((err) => `Unable to create people: ${err}`)
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.serial('create person from user when person doesnt exist', async t => {
  const user = {
    name: 'User Test',
    email: 'user@email.com',
    nickname: 'nickname',
    imgUrl: 'http://example.com/img.png'
  }
  const person = await createPersonFromUser(user)
  t.is(person.email, user.email)
})

test.serial('dont create person from user when person exists', async t => {
  const user = jwtDecode(jwtData.idToken)
  const person = await createPersonFromUser(user)
  t.false(person)
})

test.serial('convert user to person when person exists', async t => {
  const user = jwtDecode(jwtData.idToken)
  const person = await getPersonFromUser(user)
  t.is(person.email, jwtData.idTokenPayload.email)
})

test.serial('convert user to person when person does not exist', async t => {
  const user = jwtDecode(jwtData.idToken)
  const person = await getPersonFromUser(user)
  t.is(person.email, jwtData.idTokenPayload.email)
})

// test.serial('dont convert user to person when user email not verified', async t => {
//   const user = jwtDecode(jwtData.idToken)
//   user.email_verified = false
//   const person = await getPersonFromUser(user)
//   t.false(person)
// })

test.serial('convert token to session when person exists', async t => {
  const session = await parseTokenToSession(jwtData.idToken)
  const user = jwtDecode(jwtData.idToken)
  t.true(session.isAuthenticated)
  t.is(session.me.email, people[0].email)
  t.deepEqual(session.user, user)
})

test.serial('convert token to session when person does not exist', async t => {
  const session = await parseTokenToSession(jwtData.idToken)
  const user = jwtDecode(jwtData.idToken)
  t.true(session.isAuthenticated)
  t.is(session.me.email, people[0].email)
  t.deepEqual(session.user, user)
})
