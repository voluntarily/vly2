import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Organisation from '../organisation'
import MemoryMongo from '../../../util/test-memory-mongo'
import orgs from './organisation.fixture.js'

const p = {
  name: 'International Testing Corporation',
  slug: 'test-corp',
  category: 'vp',
  about: 'Evil testing empire'
}

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add organisation entries', async () => {
  // TODO catch a db error here.
  await Organisation.create(orgs).catch(() => 'Unable to create orgs')
})

test.afterEach.always(async () => {
  await Organisation.deleteMany()
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

  t.is(got[0].name, 'Albany High School')
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
  // console.log('got', got)
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
//   console.log('got', got[0].name)
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
  // console.log('got', got)
  t.is(got.length, 0)
})

test.serial('Should fail to find - invalid query', async t => {
  const res = await request(server)
    .get('/api/organisations?s={"invalid":"nomatches"}')
    .set('Accept', 'application/json')
    .expect(400)
  t.is(res.status, 400)
})
test.serial('Should correctly give subset of orgs of category', async t => {
  const res = await request(server)
    .get('/api/organisations?q={"category":"vp"}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  // console.log('got', got)
  t.is(got.length, 4)
})

test.serial('Should correctly give reverse sorted orgs of category', async t => {
  const res = await request(server)
    .get('/api/organisations?q={"category":"vp"}&s="-name"')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  // console.log('got', got)
  t.is(got.length, 4)
  t.is(got[0].slug, 'westpac')
})

test.serial('Should correctly select just the names and ids', async t => {
  const res = await request(server)
    .get('/api/organisations?q={"category":"vp"}&p={"name": 1}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  // console.log('got', got)
  t.is(got.length, 4)
  t.is(got[0].slug, undefined)
  t.is(got[0].name, 'Datacom')
})

test.serial('Should send correct data when queried against an id', async t => {
  t.plan(1)

  const organisation = new Organisation(p)
  await organisation.save()
  const id = organisation._id

  const res = await request(server)
    .get(`/api/organisations/${id}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)

  t.is(res.body.name, p.name)
})

test.serial('Should correctly add a organisation', async t => {
  t.plan(3)

  const res = await request(server)
    .post('/api/organisations')
    .send(p)
    .set('Accept', 'application/json')
    .expect(200)

  try {
  // can find by id
    const id = res.body._id
    await Organisation.findById(id).then((organisation) => {
    // console.log('findById:', organisation)
      t.is(id, organisation._id.toString())
    })

    // can find by email with then
    await Organisation.findOne({ slug: p.slug }).then((organisation) => {
      t.is(organisation.name, p.name)
    })

    // can find by email using await
    const saved = await Organisation.findOne({ slug: p.slug }).exec()
    t.is(saved.name, p.name)
  } catch (err) {
    console.log(err)
  }
})

test.serial('Should load a organisation into the db and delete them via the api', async t => {
  t.plan(2)

  const organisation = new Organisation(p)
  await organisation.save()
  const id = organisation._id

  // check organisation is there.
  const res = await request(server)
    .get(`/api/organisations/${id}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)

  t.is(res.body.name, p.name)

  // delete the record
  await request(server)
    .delete(`/api/organisations/${organisation._id}`)
    .set('Accept', 'application/json')
    .expect(200)

  // check organisation is gone
  const q = await Organisation.findOne({ slug: p.slug }).exec()
  t.is(q, null)
})
