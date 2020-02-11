import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Person from '../person'
import { jwtData, jwtDataDali } from '../../../middleware/session/__tests__/setSession.fixture'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from '../__tests__/person.fixture'
import sinon from 'sinon'
import { TOPIC_PERSON__CREATE } from '../../../services/pubsub/topic.constants'
import PubSub from 'pubsub-js'
import uuid from 'uuid'
import { Role } from '../../../services/authorize/role'
import jsonwebtoken from 'jsonwebtoken'

const createJwtIdToken = (email) => {
  const jwt = { ...jwtData }
  jwt.idTokenPayload.email = email

  return jsonwebtoken.sign(jwt.idTokenPayload, 'secret')
}

const createPerson = (roles) => {
  // Create a new user in the database directly
  const person = {
    name: 'name',
    email: `${uuid()}@test.com`,
    role: roles || [],
    status: 'active'
  }

  return Person.create(person)
}

const createPersonAndGetToken = async (roles) => {
  const user = await createPerson(roles)

  if (!roles) {
    return undefined
  } else {
    // Create a JWT token to use in our HTTP header
    return createJwtIdToken(user.email)
  }
}

test.before('before connect to database', async (t) => {
  try {
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
    await appReady
    t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  } catch (e) { console.error('person.spec.js error before', e) }
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test('List - anonymous', async t => {
  const resAnon = await request(server)
    .get('/api/people')
    .set('Accept', 'application/json')

  t.is(resAnon.status, 403)
  // Ensure there is no data in the response body
  t.true(Object.entries(resAnon.body).length === 0)
})

// Roles (other than ADMIN) can list all users, but email and phone fields are removed from the response
// VP-1264 - In the future the set of users will be more limited
for (const role of [Role.VOLUNTEER_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.ACTIVITY_PROVIDER, Role.TESTER]) {
  test(`List - ${role}`, async t => {
    const res = await request(server)
      .get('/api/people')
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([role])}`])
      .expect(200)

    t.is(res.body.length, await Person.countDocuments())

    // No contact details should be returned
    for (const person of res.body) {
      t.falsy(person.email)
      t.falsy(person.phone)
    }
  })
}

test('List - admin', async t => {
  const res = await request(server)
    .get('/api/people')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.ADMIN])}`])
    .expect(200)

  t.is(res.body.length, await Person.countDocuments())

  // All fields should be returned. Spot check a single user we know has data for each key.
  const andrew = res.body.find(user => user.email === 'andrew@groat.nz')
  t.truthy(andrew)

  const expectedFields = [
    'name',
    'nickname',
    'email',
    'about',
    'location',
    'pronoun',
    'language',
    'role',
    'status',
    'imgUrl',
    'phone',
    'sendEmailNotifications',
    'website',
    'tags'
  ]
  for (const expectedField of expectedFields) {
    t.truthy(andrew[expectedField], `The '${expectedField}' field of the response body object should contain data`)
  }
})

test('Get person by id - anonymous', async t => {
  const person = t.context.people[2] // Testy A.

  // fetch the person - no auth
  const res = await request(server)
    .get(`/api/people/${person._id}`)
    .set('Accept', 'application/json')

  t.is(res.status, 403)
})

for (const role of [Role.VOLUNTEER_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.ACTIVITY_PROVIDER, Role.TESTER]) {
  test(`Get person by id - ${role}`, async t => {
    const person = t.context.people[2] // Testy A.

    const res = await request(server)
      .get(`/api/people/${person._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([role])}`])

    t.is(res.status, 200)
    // Make sure blacklisted keys have been removed
    t.false(Object.keys(res.body).includes('email'))
    t.false(Object.keys(res.body).includes('phone'))
    t.is(res.body.name, person.name)
  })
}

test('Get person by id - admin', async t => {
  const person = t.context.people.find(p => p.email === 'andrew@groat.nz')

  const res = await request(server)
    .get(`/api/people/${person._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.ADMIN])}`])

  // All fields should be returned
  t.is(res.status, 200)
  
  const expectedFields = [
    'name',
    'nickname',
    'email',
    'about',
    'location',
    'pronoun',
    'language',
    'role',
    'status',
    'imgUrl',
    'phone',
    'sendEmailNotifications',
    'website',
    'tags'
  ]
  for (const expectedField of expectedFields) {
    t.truthy(res.body[expectedField], `The '${expectedField}' field of the response body object should contain data`)
  }
})

test.serial('create a new person', async t => {
  t.plan(7)

  // subscribe to published new person messages
  const spy = sinon.spy()
  const clock = sinon.useFakeTimers()
  PubSub.subscribe(TOPIC_PERSON__CREATE, spy)
  const p = {
    name: 'Addy McAddFace',
    // nickname: 'Addy',
    // phone: '123 456789',
    email: 'addy@omgtech.co.nz'
    // role: ['tester'],
    // tags: ['tag1', 'tag2', 'tag3']
  }

  try {
    // anon user can add a new person
    const res = await request(server)
      .post('/api/people')
      .send(p)
      .set('Accept', 'application/json')
      .expect(200)

    // confirm message published, sub called
    t.is(spy.callCount, 0)
    clock.tick(1)
    t.is(spy.callCount, 1)
    clock.restore()

    // can find by id
    const id = res.body._id
    const foundId = await Person.findById(id).exec()
    t.is(foundId.name, p.name)

    // can find by email
    const foundEmail = await Person.findOne({ email: p.email }).exec()
    t.is(foundEmail.name, p.name)

    // person has been given the default image
    t.is(foundEmail.imgUrl, '/static/img/person/person.png')

    // get the new person
    const resPerson = await request(server)
      .get(`/api/people/${id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${jwtData.idToken}`])
      .expect(200)
    t.is(resPerson.body.name, p.name)
    t.is(resPerson.body.email, p.email)

    // clean up
    await Person.deleteOne({ email: p.email })
  } catch (err) {
    console.error(err)
  }
})

test.serial('Update people', async t => {
  // update the person
  const p = t.context.people[0]
  const id = p._id
  p.phone = '000 0000 000'

  // anon user cannot update
  await request(server)
    .put(`/api/people/${id}`)
    .send(p)
    .set('Accept', 'application/json')
    .expect(403)

  // bad id cannot update, not found
  await request(server)
    .put('/api/people/notapersonid')
    .send(p)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .expect(404)

  // wrong id cannot update, bad request
  await request(server)
    .put('/api/people/5d9fe53e4eb179218c8d1d2b')
    .send(p)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .expect(404)

  const resUpdated = await request(server)
    .put(`/api/people/${id}`)
    .send(p)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
  t.is(resUpdated.body.phone, p.phone)
})

test('Anon user cannot remove a user', async t => {
  const p = t.context.people[3]

  // try to delete the record anonymously
  await request(server)
    .delete(`/api/people/${p._id}`)
    .set('Accept', 'application/json')
    .expect(403)

  // check person is still in the database
  const queriedPerson = await Person.findOne({ email: p.email }).exec()
  t.is(queriedPerson.name, p.name)
  t.is(queriedPerson.email, p.email)
})
