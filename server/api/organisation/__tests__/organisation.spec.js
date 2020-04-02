import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Organisation from '../organisation'
import MemoryMongo from '../../../util/test-memory-mongo'
import orgs from './organisation.fixture.js'
import { v4 as uuid } from 'uuid'
import Person from '../../../../server/api/person/person'
import { jwtData } from '../../../../server/middleware/session/__tests__/setSession.fixture'
import jsonwebtoken from 'jsonwebtoken'
import { OrganisationRole } from '../organisation.constants'

const testOrg = {
  name: 'Test Organisation',
  slug: 'test-organisation',
  role: [OrganisationRole.VOLUNTEER_PROVIDER, OrganisationRole.ACTIVITY_PROVIDER],
  imgUrl: 'https://example.com/image1',
  info: {
    about: 'Industry in the classroom.',
    members: 'You are a member of Test Organisation.',
    followers: 'You are a follower of Test Organisation.',
    joiners: 'You are a nearly a member of Test Organisation.',
    outsiders: 'You could be a member of Test Organisation.'
  }
}

const testOrgNoImg = {
  name: 'Test Organisation 2',
  slug: 'test-organisation-2',
  role: [OrganisationRole.VOLUNTEER_PROVIDER],
  info: {
    about: 'Industry in the classroom.',
    members: 'You are a member of Test Organisation.',
    followers: 'You are a follower of Test Organisation.',
    joiners: 'You are a nearly a member of Test Organisation.',
    outsiders: 'You could be a member of Test Organisation.'
  }
}

/**
 * Create a new user with the OrganisationRole.ADMIN role.
 * @param {string[]} roles Array of roles.
 */
const createAdminAndGetToken = async () => {
  // Create a new user in the database directly
  const person = {
    name: 'name',
    email: `${uuid()}@test.com`,
    role: [OrganisationRole.ADMIN],
    status: 'active'
  }

  await Person.create(person)

  const jwt = { ...jwtData }
  jwt.idTokenPayload.email = person.email

  return jsonwebtoken.sign(jwt.idTokenPayload, 'secret')
}

test.before('before connect to database', async (t) => {
  try {
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
    await appReady
    await Organisation.create(orgs).catch(() => 'Unable to create orgs')
  } catch (e) { console.error('organisation.spec.js before error:', e) }
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.serial('verify fixture database has orgs', async t => {
  const count = await Organisation.countDocuments()
  t.is(count, orgs.length)

  // can find by things
  await Organisation.findOne({ slug: 'datacom' }).then((organisation) => {
    t.is(organisation.name, 'Datacom')
  })

  await Organisation.find().then((p) => {
    t.is(orgs.length, p.length)
  })
})

test.serial('Should correctly give count of all orgs sorted alpha', async t => {
  const res = await request(server)
    .get('/api/organisations')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(orgs.length, got.length)

  t.is(got[0].name, 'Albany Senior High School')
})

test.serial('Should handle bad JSON', async t => {
  t.plan(1)

  const res = await request(server)
    .get('/api/organisations?q={"nocolon" "baddata"}')
    .set('Accept', 'application/json')
  t.is(res.status, 400)
})

test.serial('Should correctly give subset of orgs matching slug', async t => {
  const res = await request(server)
    .get('/api/organisations?q={"slug":"datacom"}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 1)
})

// test.only('Should correctly give a list with only name field', async t => {
//   const nameOrganisation = "OMGTech";
//   //p={"name": 1"} when applied on url, json is undefined
//   const res = await request(server)
//     .get('/api/organisations?q={"name":"' + nameOrganisation + '"}&p={"name": "1"}')
//     .set('Accept', 'application/json')
//     .expect(200)
//     .expect('Content-Type', /json/)
//   const got = res.body
//   ('got', got[0].name)
//   t.is(got[0].name, nameOrganisation)
//   t.is(got[0].about, null)
// })

test.serial('Should find no matches', async t => {
  const res = await request(server)
    .get('/api/organisations?q={"slug":"nomatches"}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 0)
})

test.serial('Should fail to find - invalid query', async t => {
  const res = await request(server)
    .get('/api/organisations?s={"invalid":"nomatches"}')
    .set('Accept', 'application/json')
    .expect(404)
  t.is(res.status, 404)
})

test.serial('Should fail to find - Bad request ', async t => {
  const res = await request(server)
    .get('/api/organisations?s={this is not json}')
    .set('Accept', 'application/json')
    .expect(400)
  t.is(res.status, 400)
})
test.serial('Should correctly give subset of orgs of role', async t => {
  const res = await request(server)
    .get('/api/organisations?q={"role":"vp"}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 3)
})

test.serial('Should correctly give reverse sorted orgs of role', async t => {
  const res = await request(server)
    .get('/api/organisations?q={"role":"vp"}&s="-name"')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 3)
  t.is(got[0].slug, 'westpac-ltd')
})

// Searching for something in the subtitle (case insensitive)
// [VP-508] Add searching for orgs by role, name and tags
// test.serial('Should correctly give opportunity 2 when searching by "helpers"', async t => {
//   const res = await request(server)
//     .get('/api/opportunities?search=HeLPErs')
//     .set('Accept', 'application/json')
//     .expect(200)
//     .expect('Content-Type', /json/)
//   const got = res.body
//   (got)
//   // t.is(orgs[1].name, got[0].name)
//   t.is(2, got.length)
// })

const queryString = params => Object.keys(params).map((key) => {
  return key + '=' + params[key]
}).join('&')

test.serial('Should correctly select just the names and ids', async t => {
  const query = {
    q: JSON.stringify({ role: OrganisationRole.VOLUNTEER_PROVIDER }),
    p: 'name imgUrl role'
  }
  const res = await request(server)
    .get(`/api/organisations?${queryString(query)}`)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 3)
  t.is(got[0].slug, undefined)
  t.is(got[0].name, 'Datacom')
})

test.serial('Should send correct data when queried against an id', async t => {
  t.plan(1)

  const organisation = new Organisation(testOrg)
  await organisation.save()
  const id = organisation._id

  const res = await request(server)
    .get(`/api/organisations/${id}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)

  t.is(res.body.name, testOrg.name)
})

test.serial('Should correctly add an organisation', async t => {
  t.plan(4)

  const res = await request(server)
    .post('/api/organisations')
    .send(testOrgNoImg)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${await createAdminAndGetToken()}`])
    .expect(200)

  try {
  // can find by id
    const id = res.body._id
    await Organisation.findById(id).then((organisation) => {
      t.is(id, organisation._id.toString())
    })

    // can find by email with then
    await Organisation.findOne({ slug: testOrgNoImg.slug }).then((organisation) => {
      t.is(organisation.name, testOrgNoImg.name)
    })

    // can find by email using await
    const saved = await Organisation.findOne({ slug: testOrgNoImg.slug }).exec()
    t.is(saved.name, testOrgNoImg.name)

    // organisation has been given the default image
    t.is(saved.imgUrl, '/static/img/organisation/organisation.png')
  } catch (err) {
    console.error(err)
  }
})

test.serial('Should load a organisation into the db and delete them via the api', async t => {
  t.plan(2)

  const testOrgDelete = {
    name: 'Test Organisation Delete',
    slug: 'test-organisation-delete',
    role: [OrganisationRole.VOLUNTEER_PROVIDER],
    info: {
      about: 'Industry in the classroom.',
      members: 'You are a member of Test Organisation.',
      followers: 'You are a follower of Test Organisation.',
      joiners: 'You are a nearly a member of Test Organisation.',
      outsiders: 'You could be a member of Test Organisation.'
    }
  }

  const organisation = new Organisation(testOrgDelete)
  await organisation.save()
  const id = organisation._id

  // check organisation is there.
  const res = await request(server)
    .get(`/api/organisations/${id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${await createAdminAndGetToken()}`])
    .expect('Content-Type', /json/)
    .expect(200)

  t.is(res.body.name, testOrgDelete.name)

  // delete the record
  await request(server)
    .delete(`/api/organisations/${organisation._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${await createAdminAndGetToken()}`])
    .expect(204)

  // check organisation is gone
  const q = await Organisation.findOne({ slug: testOrgDelete.slug }).exec()
  t.is(q, null)
})
