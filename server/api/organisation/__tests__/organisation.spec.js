import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Organisation from '../organisation'
import MemoryMongo from '../../../util/test-memory-mongo'
// Initial orgs added into test db
import orgs from './organisation.fixture.js'
let memMongo

const p = {
  name: 'International Testing Corporation',
  slug: 'test-corp',
  type: 'vp',
  about: 'Evil testing empire'
}

test.before('before connect to database', async () => {
  await appReady
  memMongo = new MemoryMongo()
  await memMongo.start()
})

test.after.always(async () => {
  await memMongo.stop()
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

test.serial('Should correctly give number of orgs', async t => {
  const res = await request(server)
    .get('/api/organisations')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)

  t.is(orgs.length, res.body.length)
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
