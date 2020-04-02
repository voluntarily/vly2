import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Person from '../person'
import { PersonListFields, PersonFriendFields } from '../person.constants'
import { jwtData, jwtDataDali } from '../../../middleware/session/__tests__/setSession.fixture'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from './person.fixture'
import { v4 as uuid } from 'uuid'
import { Role } from '../../../services/authorize/role'
import jsonwebtoken from 'jsonwebtoken'
import Organisation from '../../organisation/organisation'
import Member from '../../member/member'
import Opportunity from '../../opportunity/opportunity'
import { Interest } from '../../interest/interest'
import { InterestStatus } from '../../interest/interest.constants'

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
    role: [...roles, Role.BASIC],
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
  t.is(resAnon.body.error, 'Auth cannot list Person')
})

// Roles (other than ADMIN) can list all users, but email and phone fields are removed from the response
// VP-1264 - In the future the set of users will be more limited
for (const role of [Role.BASIC, Role.VOLUNTEER, Role.OPPORTUNITY_PROVIDER, Role.ACTIVITY_PROVIDER, Role.SUPPORT]) {
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

  for (const expectedField of PersonListFields) {
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

for (const role of [Role.VOLUNTEER, Role.OPPORTUNITY_PROVIDER, Role.ACTIVITY_PROVIDER]) {
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

// We trim certain fields (email, phone etc) from each user, however when asking for data for the current
// user we should return all fields
test.serial('Get person by id - self returns all fields', async t => {
  // Create a new user in the database directly
  const email = `${uuid()}@test.com`

  await Person.create({
    email,
    nickname: 'self',
    name: 'Self Self',
    about: 'About self',
    phone: 'Phone self',
    language: 'en',
    imgUrl: 'https://img.com',
    facebook: 'https://facebook.com/self',
    website: 'https://self.com',
    twitter: 'https://twitter.com/self',
    role: [Role.ACTIVITY_PROVIDER],
    status: 'active',
    pronoun: {
      subject: 'a2',
      object: 'b2',
      possessive: 'c2'
    },
    tags: ['cars', 'trucks'],
    education: 'self university',
    job: 'Self',
    placeOfWork: 'POW Self'
  })

  const person = await Person.findOne({ email }).lean()

  const res = await request(server)
    .get(`/api/people/${person._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${createJwtIdToken(email)}`]) // Self

  t.is(res.status, 200)
  // Make sure all person fields are returned for a request about myself
  t.is(res.body._id, person._id.toString())
  for (const key of PersonFriendFields) {
    t.deepEqual(res.body[key], person[key], `The '${key}' field on the person response object (when requesting as self) is invalid`)
  }
})

for (const role of [Role.ADMIN, Role.SUPPORT]) {
  test(`Get person by id - ${role} - should return all list fields`, async t => {
    const person = t.context.people.find(p => p.email === 'andrew@groat.nz')

    const res = await request(server)
      .get(`/api/people/${person._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([role])}`])

    // All fields should be returned
    t.is(res.status, 200)

    for (const expectedField of PersonListFields) {
      t.truthy(res.body[expectedField], `The '${expectedField}' field of the response body object should contain data`)
    }
  })
}

// SKIP as we no longer share details across an organisation.
test.skip('Get person by id - requested person is in my organisation', async t => {
  const personA = await createPerson([Role.VOLUNTEER])
  const personB = await Person.create({
    name: 'name',
    email: `${uuid()}@test.com`,
    role: [Role.VOLUNTEER],
    status: 'active',
    language: 'en',
    website: 'https://reddit.com',
    // Personal fields
    phone: 'Phone self',
    education: 'self university',
    job: 'Self',
    locations: ['Loc'],
    placeOfWork: 'POW'
  })

  const org = await Organisation.create({
    name: `${uuid()}`,
    slug: `${uuid()}`
  })

  // Join person A and B to the same org
  await Member.create({
    person: personA,
    organisation: org
  })
  await Member.create({
    person: personB,
    organisation: org
  })

  const res = await request(server)
    .get(`/api/people/${personB._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${createJwtIdToken([personA.email])}`])

  // Personal fields should be returned
  t.is(res.status, 200)
  t.is(res.body.phone, 'Phone self')
  t.is(res.body.education, 'self university')
  t.is(res.body.job, 'Self')
  t.truthy(res.body.locations)
  t.is(res.body.locations.length, 1)
  t.is(res.body.locations[0], 'Loc')
  t.is(res.body.placeOfWork, 'POW')
})

test('Get person by id - requested person is invited to an opportunity of mine', async t => {
  const personA = await createPerson([Role.VOLUNTEER])
  const personB = await Person.create({
    name: 'name',
    email: `${uuid()}@test.com`,
    role: [Role.VOLUNTEER],
    status: 'active',
    language: 'en',
    website: 'https://reddit.com',
    // Personal fields
    phone: 'Phone self',
    education: 'self university',
    job: 'Self',
    locations: ['Loc'],
    placeOfWork: 'POW'
  })

  // PersonA creates an op
  const op = await Opportunity.create({
    requestor: personA
  })

  // PersonB is invited
  await Interest.create({
    person: personB,
    opportunity: op._id,
    status: InterestStatus.INVITED
  })

  const res = await request(server)
    .get(`/api/people/${personB._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${createJwtIdToken([personA.email])}`])

  // Personal fields should be returned
  t.is(res.status, 200)
  t.is(res.body.phone, 'Phone self')
  t.is(res.body.education, 'self university')
  t.is(res.body.job, 'Self')
  t.truthy(res.body.locations)
  t.is(res.body.locations.length, 1)
  t.is(res.body.locations[0], 'Loc')
  t.is(res.body.placeOfWork, 'POW')
})

for (const role of [undefined, Role.VOLUNTEER, Role.OPPORTUNITY_PROVIDER, Role.ACTIVITY_PROVIDER, Role.SUPPORT]) {
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

for (const role of [Role.VOLUNTEER, Role.OPPORTUNITY_PROVIDER]) {
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

for (const role of [Role.ADMIN, Role.ORG_ADMIN, Role.SUPPORT]) {
  test.serial(`Update - ${role} can update person`, async t => {
    const person = await createPerson([Role.ADMIN])

    const newName = uuid()

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: newName,
        role: [Role.VOLUNTEER],
        status: 'active',
        phone: 'testphone'
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([role])}`)

    t.is(res.status, 200)

    const person2 = await Person.findById(person._id)
    t.is(person2.name, newName)
    t.is(person2.email, person.email)
    t.is(person2.role[0], Role.VOLUNTEER)
    t.is(person2.status, 'active')
    t.is(person2.phone, 'testphone')
  })
}

test.serial('Update - can update self (even with role which denies update)', async t => {
  const person = await createPerson([Role.VOLUNTEER])
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

for (const role of [Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.RESOURCE_PROVIDER, Role.VOLUNTEER]) {
  test.serial(`Delete - ${role} cannot delete users`, async t => {
    const person = await createPerson([Role.VOLUNTEER])

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

for (const role of [Role.ADMIN, Role.SUPPORT]) {
  test.serial(`Delete - ${role} can delete any user`, async t => {
    const person = await createPerson([Role.VOLUNTEER])

    const res = await request(server)
      .delete(`/api/people/${person._id}`)
      .send()
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([role])}`)

    t.true(res.ok)

    const person2 = await Person.findById(person._id)
    t.falsy(person2)
  })
}

test.serial('Delete - Owner can delete their account', async t => {
  // Volunteer role normally cannot delete an account, so for this code to succeed it will trigger the check
  // that this request is for the current user's account
  const person = await createPerson([Role.VOLUNTEER])

  const res = await request(server)
    .delete(`/api/people/${person._id}`)
    .send()
    .set('Accept', 'application/json')
    .set('Cookie', `idToken=${createJwtIdToken(person.email)}`) // Current user

  t.true(res.ok)

  const person2 = await Person.findById(person._id)
  t.falsy(person2)
})

for (const role of [Role.ACTIVITY_PROVIDER, Role.ADMIN, Role.OPPORTUNITY_PROVIDER, Role.RESOURCE_PROVIDER, Role.SUPPORT, Role.VOLUNTEER]) {
  test.serial(`Update - ADMIN can change a persons role to ${role}`, async t => {
    const person = await createPerson([Role.VOLUNTEER])

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

for (const currentUserRole of [Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.RESOURCE_PROVIDER, Role.SUPPORT, Role.VOLUNTEER]) {
  test.serial(`Update - ${currentUserRole} cannot assign the ADMIN role to a user`, async t => {
    const person = await createPerson([Role.VOLUNTEER])

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
    t.is(person2.role[0], Role.VOLUNTEER)
  })
}

test.serial('Update - ADMIN can assign the ADMIN role to a user', async t => {
  const person = await createPerson([Role.VOLUNTEER])

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

for (const currentUserRole of [Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.RESOURCE_PROVIDER, Role.SUPPORT, Role.VOLUNTEER]) {
  test.serial(`Update - ${currentUserRole} cannot assign the SUPPORT role to a user`, async t => {
    const person = await createPerson([Role.VOLUNTEER])

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        email: `${uuid()}@test.com`,
        role: [Role.SUPPORT], // Try and become a SUPPORT
        status: 'active',
        phone: 'testphone'
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([currentUserRole])}`)

    // Forbidden to change to the SUPPORT role
    t.is(res.status, 403)

    // Assert the user's role has remained as is
    const person2 = await Person.findById(person._id)
    t.is(person2.role[0], Role.VOLUNTEER)
  })
}

test.serial('Update - ADMIN can assign the SUPPORT role to a user', async t => {
  const person = await createPerson([Role.VOLUNTEER])

  const res = await request(server)
    .put(`/api/people/${person._id}`)
    .send({
      name: 'testname',
      email: `${uuid()}@test.com`,
      role: [Role.SUPPORT], // Allowed to become an SUPPORT
      status: 'active',
      phone: 'testphone'
    })
    .set('Accept', 'application/json')
    .set('Cookie', `idToken=${await createPersonAndGetToken([Role.ADMIN])}`)

  t.is(res.status, 200)

  const person2 = await Person.findById(person._id)
  t.is(person2.role[0], Role.SUPPORT)
})

for (const role of [Role.ORG_ADMIN, Role.ANON, Role.ALL, 'undefined', 'null']) {
  test.serial(`Update - ${role} is not a role which can be set via the API`, async t => {
    const person = await createPerson([Role.VOLUNTEER])

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
    t.is(person2.role[0], Role.VOLUNTEER)
  })
}

for (const role of [Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.ORG_ADMIN, Role.RESOURCE_PROVIDER, Role.VOLUNTEER]) {
  test.serial(`Update - Only ADMIN can change a users email field - ${role} cannot`, async t => {
    const person = await createPerson([Role.VOLUNTEER])
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

    t.true([400, 403].includes(res.status))

    const person2 = await Person.findById(person._id)
    t.is(person2.email, originalEmail)
  })
}
// test.serial('Update - Only ADMIN can change a users email field', async t => {
//   const person = await createPerson([Role.VOLUNTEER])

//   const payload = {
//     name: 'testname',
//     email: `${uuid()}@test.com`, // Update the users email to a new value
//     role: person.role,
//     status: 'active',
//     phone: 'testphone'
//   }

//   const res = await request(server)
//     .put(`/api/people/${person._id}`)
//     .send(payload)
//     .set('Accept', 'application/json')
//     .set('Cookie', `idToken=${await createPersonAndGetToken([Role.ADMIN])}`)

//   t.is(res.status, 200)

//   const person2 = await Person.findById(person._id)
//   t.is(person2.email, payload.email)
// })

for (const role of [Role.ADMIN, Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.ORG_ADMIN, Role.RESOURCE_PROVIDER, Role.VOLUNTEER]) {
  test.serial(`Update - no one can update createdAt field - ${role}`, async t => {
    const person = await createPerson([Role.VOLUNTEER])
    const originalCreatedAt = person.createdAt.toISOString()

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        role: person.role,
        status: 'active',
        phone: 'testphone',
        createdAt: '2030-12-18T00:14:42.432Z'
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${await createPersonAndGetToken([role])}`)

    t.true([400, 403].includes(res.status))

    const person2 = await Person.findById(person._id)
    t.is(person2.createdAt.toISOString(), originalCreatedAt)
  })
}
for (const createdAt of ['', '   ', null]) {
  test.serial(`Update - cannot set createdAt to falsey values - '${createdAt}'`, async t => {
    const person = await createPerson([Role.VOLUNTEER])
    const originalCreatedAt = person.createdAt.toISOString()

    const res = await request(server)
      .put(`/api/people/${person._id}`)
      .send({
        name: 'testname',
        role: person.role,
        status: 'active',
        phone: 'testphone',
        createdAt
      })
      .set('Accept', 'application/json')
      .set('Cookie', `idToken=${createJwtIdToken(person.email)}`)

    t.is(res.status, 400)

    const person2 = await Person.findById(person._id)
    t.is(person2.createdAt.toISOString(), originalCreatedAt)
  })
}

// Test invalid language values, including empty string and falsey
for (const lang of ['TEST', '  ', '']) {
  test.serial(`Update - only permitted languages can be set - invalid language value: '${lang}' - current user`, async t => {
    const person = await createPerson([Role.VOLUNTEER])

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
  const person = await createPerson([Role.VOLUNTEER])

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
  const person = await createPerson([Role.VOLUNTEER])

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
    const person = await createPerson([Role.VOLUNTEER])

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
    const person = await createPerson([Role.VOLUNTEER])
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
  const person = await createPerson([Role.VOLUNTEER])
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
