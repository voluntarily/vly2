import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Person from '../person'
import { jwtData, jwtDataDali } from '../../../middleware/session/__tests__/setSession.fixture'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from '../__tests__/person.fixture'
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
    status: 'active',
    language: 'en',
    website: 'https://reddit.com'
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

for (const role of [undefined, Role.VOLUNTEER_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.ACTIVITY_PROVIDER, Role.TESTER]) {
  test.serial(`Create a new person - ${role || 'Anonymous'} is denied`, async t => {
    const res = await request(server)
      .post('/api/people')
      .send({
        name: 'Addy McAddFace',
        email: 'addy@omgtech.co.nz'
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([role])}`])

    t.is(res.status, 403)
  })
}

test.serial('Update - anonymous user cannot update', async t => {
  const person = t.context.people[0]

  const res = await request(server)
    .put(`/api/people/${person._id}`)
    .send({
      name: 'testname',
      email: 'test@email.nz',
      role: ['admin'],
      status: 'active',
      phone: 'testphone'
    })
    .set('Accept', 'application/json')

  // Forbidden
  t.is(res.status, 403)
  // Make sure the person in the database hasn't changed
  const person2 = await Person.findById(person._id)
  t.is(person2.phone, person.phone)
})

for (const role of [Role.VOLUNTEER_PROVIDER, Role.OPPORTUNITY_PROVIDER]) {
  test.serial(`Update - ${role} cannot update person`, async t => {
    const person = t.context.people[0]

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        email: 'test@email.nz',
        role: ['admin'],
        status: 'active',
        phone: 'testphone'
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([role])}`)

    // Forbidden
    t.is(res.status, 403)
    // Make sure the person in the database hasn't changed
    const person2 = await Person.findById(person._id)
    t.is(person2.name, person.name)
    t.is(person2.email, person.email)
    t.is(person2.role[0], person.role[0])
    t.is(person2.status, person.status)
    t.is(person2.phone, person.phone)
  })
}

for (const role of [Role.ADMIN, Role.ORG_ADMIN, Role.TESTER]) {
  test.serial(`Update - ${role} can update person`, async t => {
    const person = await createPerson([Role.ADMIN])

    const newName = uuid()

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: newName,
        role: [Role.VOLUNTEER_PROVIDER],
        status: 'active',
        phone: 'testphone'
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([role])}`)

    t.is(res.status, 200)

    const person2 = await Person.findById(person._id)
    t.is(person2.name, newName)
    t.is(person2.email, person.email)
    t.is(person2.role[0], Role.VOLUNTEER_PROVIDER)
    t.is(person2.status, 'active')
    t.is(person2.phone, 'testphone')
  })
}

test.serial('Update - can update self (even with role which denies update)', async t => {
  const person = await createPerson([Role.VOLUNTEER_PROVIDER])
  const originalEmail = person.email

  const res = await request(server)
    .put(`/api/people/${person._id}`)
    .send({
      name: 'testname',
      role: [Role.RESOURCE_PROVIDER],
      status: 'active',
      phone: 'testphone'
    })
    .set('Accept', 'application/json')
    .set('Cookie', `idToken=${createJwtIdToken(person.email)}`)

  t.is(res.status, 200)

  const person2 = await Person.findById(person._id)
  t.is(person2.name, 'testname')
  t.is(person2.email, originalEmail)
  t.is(person2.role[0], Role.RESOURCE_PROVIDER)
  t.is(person2.status, 'active')
  t.is(person2.phone, 'testphone')
})

test.serial('Update - admin - bad id cannot update, not found', async t => {
  const p = t.context.people[0]
  p.phone = '000 0000 000'

  const res = await request(server)
    .put('/api/people/notapersonid')
    .send(p)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])

  t.is(res.status, 404)
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

for (const role of [Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.RESOURCE_PROVIDER, Role.TESTER, Role.VOLUNTEER_PROVIDER]) {
  test.serial(`Delete - ${role} cannot delete users`, async t => {
    const person = await createPerson([Role.VOLUNTEER_PROVIDER])

    const res = await request(server)
      .delete(`/api/people/${person._id}`)
      .send()
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([role])}`)

    t.is(res.status, 403)

    const person2 = await Person.findById(person._id)
    t.truthy(person2)
  })
}

test.serial(`Delete - ADMIN can delete users`, async t => {
  const person = await createPerson([Role.VOLUNTEER_PROVIDER])

  const res = await request(server)
    .delete(`/api/people/${person._id}`)
    .send()
    .set('Accept', 'application/json')
    .set('Cookie', `idToken=${await createPersonAndGetToken([Role.ADMIN])}`)

  t.is(res.status, 200)

  const person2 = await Person.findById(person._id)
  t.falsy(person2)
})

for (const role of [Role.ACTIVITY_PROVIDER, Role.ADMIN, Role.OPPORTUNITY_PROVIDER, Role.RESOURCE_PROVIDER, Role.TESTER, Role.VOLUNTEER_PROVIDER]) {
  test.serial(`Update - ADMIN can change a persons role to ${role}`, async t => {
    const person = await createPerson([Role.VOLUNTEER_PROVIDER])

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        email: `${uuid()}@test.com`,
        role: [role],
        status: 'active',
        phone: 'testphone'
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([Role.ADMIN])}`)

    t.is(res.status, 200)

    const person2 = await Person.findById(person._id)
    t.is(person2.role[0], role)
  })
}

for (const currentUserRole of [Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.RESOURCE_PROVIDER, Role.TESTER, Role.VOLUNTEER_PROVIDER]) {
  test.serial(`Update - ${currentUserRole} cannot assign the ADMIN role to a user`, async t => {
    const person = await createPerson([Role.VOLUNTEER_PROVIDER])

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        email: `${uuid()}@test.com`,
        role: [Role.ADMIN], // Try and become an ADMIN
        status: 'active',
        phone: 'testphone'
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([currentUserRole])}`)

    // Forbidden to change to the ADMIN role
    t.is(res.status, 403)

    // Assert the user's role has remained as is
    const person2 = await Person.findById(person._id)
    t.is(person2.role[0], Role.VOLUNTEER_PROVIDER)
  })
}

test.serial('Update - ADMIN can assign the ADMIN role to a user', async t => {
  const person = await createPerson([Role.VOLUNTEER_PROVIDER])

  const res = await request(server)
    .put(`/api/people/${person._id}`)
    .send({
      name: 'testname',
      email: `${uuid()}@test.com`,
      role: [Role.ADMIN], // Allowed to become an ADMIN
      status: 'active',
      phone: 'testphone'
    })
    .set('Accept', 'application/json')
    .set('Cookie', `idToken=${await createPersonAndGetToken([Role.ADMIN])}`)

  t.is(res.status, 200)

  const person2 = await Person.findById(person._id)
  t.is(person2.role[0], Role.ADMIN)
})

for (const currentUserRole of [Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.RESOURCE_PROVIDER, Role.TESTER, Role.VOLUNTEER_PROVIDER]) {
  test.serial(`Update - ${currentUserRole} cannot assign the TESTER role to a user`, async t => {
    const person = await createPerson([Role.VOLUNTEER_PROVIDER])

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        email: `${uuid()}@test.com`,
        role: [Role.TESTER], // Try and become a TESTER
        status: 'active',
        phone: 'testphone'
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([currentUserRole])}`)

    // Forbidden to change to the TESTER role
    t.is(res.status, 403)

    // Assert the user's role has remained as is
    const person2 = await Person.findById(person._id)
    t.is(person2.role[0], Role.VOLUNTEER_PROVIDER)
  })
}

test.serial('Update - ADMIN can assign the TESTER role to a user', async t => {
  const person = await createPerson([Role.VOLUNTEER_PROVIDER])

  const res = await request(server)
    .put(`/api/people/${person._id}`)
    .send({
      name: 'testname',
      email: `${uuid()}@test.com`,
      role: [Role.TESTER], // Allowed to become an TESTER
      status: 'active',
      phone: 'testphone'
    })
    .set('Accept', 'application/json')
    .set('Cookie', `idToken=${await createPersonAndGetToken([Role.ADMIN])}`)

  t.is(res.status, 200)

  const person2 = await Person.findById(person._id)
  t.is(person2.role[0], Role.TESTER)
})

for (const role of [Role.ORG_ADMIN, Role.ANON, Role.ALL, 'undefined', 'null']) {
  test.serial(`Update - ${role} is not a role which can be set via the API`, async t => {
    const person = await createPerson([Role.VOLUNTEER_PROVIDER])

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        email: `${uuid()}@test.com`,
        role: [role], // Bad role
        status: 'active',
        phone: 'testphone'
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([Role.ADMIN])}`)

    t.is(res.status, 400)

    const person2 = await Person.findById(person._id)
    t.is(person2.role[0], Role.VOLUNTEER_PROVIDER)
  })
}

for (const role of [Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.ORG_ADMIN, Role.RESOURCE_PROVIDER, Role.TESTER, Role.VOLUNTEER_PROVIDER]) {
  test.serial(`Update - Only ADMIN can change a users email field - ${role} cannot`, async t => {
    const person = await createPerson([Role.VOLUNTEER_PROVIDER])
    const originalEmail = person.email

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        email: `${uuid()}@test.com`, // Update the users email to a new value
        role: person.role,
        status: 'active',
        phone: 'testphone'
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([role])}`)

    t.is(res.status, 403)

    const person2 = await Person.findById(person._id)
    t.is(person2.email, originalEmail)
  })
}
test.serial('Update - Only ADMIN can change a users email field', async t => {
  const person = await createPerson([Role.VOLUNTEER_PROVIDER])

  const payload = {
    name: 'testname',
    email: `${uuid()}@test.com`, // Update the users email to a new value
    role: person.role,
    status: 'active',
    phone: 'testphone'
  }

  const res = await request(server)
    .put(`/api/people/${person._id}`)
    .send(payload)
    .set('Accept', 'application/json')
    .set('Cookie', `idToken=${await createPersonAndGetToken([Role.ADMIN])}`)

  t.is(res.status, 200)

  const person2 = await Person.findById(person._id)
  t.is(person2.email, payload.email)
})

for (const role of [Role.ADMIN, Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.ORG_ADMIN, Role.RESOURCE_PROVIDER, Role.TESTER, Role.VOLUNTEER_PROVIDER]) {
  test.serial(`Update - no one can update dateAdded field - ${role}`, async t => {
    const person = await createPerson([Role.VOLUNTEER_PROVIDER])
    const originalDateAdded = person.dateAdded.toISOString()

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        role: person.role,
        status: 'active',
        phone: 'testphone',
        dateAdded: '2030-12-18T00:14:42.432Z'
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([role])}`)

    t.is(res.status, 403)

    const person2 = await Person.findById(person._id)
    t.is(person2.dateAdded.toISOString(), originalDateAdded)
  })
}
for (const dateAdded of ['', '   ', null]) {
  test.serial(`Update - cannot set dateAdded to falsey values - '${dateAdded}'`, async t => {
    const person = await createPerson([Role.VOLUNTEER_PROVIDER])
    const originalDateAdded = person.dateAdded.toISOString()

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        role: person.role,
        status: 'active',
        phone: 'testphone',
        dateAdded
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${createJwtIdToken(person.email)}`)

    t.is(res.status, 403)

    const person2 = await Person.findById(person._id)
    t.is(person2.dateAdded.toISOString(), originalDateAdded)
  })
}

// Test invalid language values, including empty string and falsey
for (const lang of ['TEST', '  ', '']) {
  test.serial(`Update - only permitted languages can be set - invalid language value: '${lang}' - current user`, async t => {
    const person = await createPerson([Role.VOLUNTEER_PROVIDER])

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        status: 'active',
        phone: 'testphone',
        language: 'TEST'
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${createJwtIdToken(person.email)}`)

    t.is(res.status, 400)

    const person2 = await Person.findById(person._id)
    t.is(person2.language, 'en')
  })
}

test.serial('Update - only permitted languages can be set - valid language - current user', async t => {
  const person = await createPerson([Role.VOLUNTEER_PROVIDER])

  const res = await request(server)
    .put(`/api/people/${person._id}`)
    .send({
      name: 'testname',
      status: 'active',
      phone: 'testphone',
      language: 'fr'
    })
    .set('Accept', 'application/json')
    .set('Cookie', `idToken=${createJwtIdToken(person.email)}`)

  t.is(res.status, 200)

  const person2 = await Person.findById(person._id)
  t.is(person2.language, 'fr')
})

test.serial('Update - language value is case sensitive', async t => {
  const person = await createPerson([Role.VOLUNTEER_PROVIDER])

  const res = await request(server)
    .put(`/api/people/${person._id}`)
    .send({
      name: 'testname',
      status: 'active',
      phone: 'testphone',
      language: 'FR'
    })
    .set('Accept', 'application/json')
    .set('Cookie', `idToken=${createJwtIdToken(person.email)}`)

  t.is(res.status, 400)

  const person2 = await Person.findById(person._id)
  t.is(person2.language, 'en')
})

for (const website of ['http://space.com', 'https://space.com', 'http://sls.rockets.nasa', 'space.com']) {
  test.serial(`Update - website field validation rules - valid - '${website}'`, async t => {
    const person = await createPerson([Role.VOLUNTEER_PROVIDER])

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        status: 'active',
        phone: 'testphone',
        website
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${createJwtIdToken(person.email)}`)

    t.is(res.status, 200)

    const person2 = await Person.findById(person._id)
    t.is(person2.website, website)
  })
}
for (const website of [null, '', 'abc', '123']) {
  test.serial(`Update - website field validation rules - invalid - '${website}'`, async t => {
    const person = await createPerson([Role.VOLUNTEER_PROVIDER])
    const originalWebsite = person.website

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        status: 'active',
        phone: 'testphone',
        website
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${createJwtIdToken(person.email)}`)

    t.is(res.status, 400)

    const person2 = await Person.findById(person._id)
    t.is(person2.website, originalWebsite)
  })
}
test.serial('Update - website field validation rules - invalid - too long', async t => {
  const person = await createPerson([Role.VOLUNTEER_PROVIDER])
  const originalWebsite = person.website

  let website = ''
  for (let i = 0; i < 3000; i++) {
    website += i
  }

  const res = await request(server)
    .put(`/api/people/${person._id}`)
    .send({
      name: 'testname',
      status: 'active',
      phone: 'testphone',
      website
    })
    .set('Accept', 'application/json')
    .set('Cookie', `idToken=${createJwtIdToken(person.email)}`)

  t.is(res.status, 400)

  const person2 = await Person.findById(person._id)
  t.is(person2.website, originalWebsite)
})
