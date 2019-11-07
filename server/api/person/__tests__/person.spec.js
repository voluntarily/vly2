import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Person from '../person'
import { jwtData, jwtDataDali } from '../../../middleware/session/__tests__/setSession.fixture'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from '../__tests__/person.fixture'

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

test('verify fixture database has people', async t => {
  const count = await Person.countDocuments()
  t.is(count, people.length)
  // can find by email with then
  const andrew = await Person.findOne({ email: 'andrew@groat.nz' })
  t.is(andrew.nickname, 'avowkind')

  const dali = await Person.findOne({ email: 'salvador@voluntarily.nz' })
  t.is(dali.nickname, 'Dali')

  await Person.find().then((p) => {
    t.is(people.length, p.length)
  })
})

test('list everyone - Anon user', async t => {
  const resAnon = await request(server)
    .get('/api/people')
    .set('Accept', 'application/json')
  t.is(resAnon.status, 403) // Return data response will be undefined for 403 response
})

test('list everyone - General User', async t => {
  // general user
  const res = await request(server)
    .get('/api/people')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .expect(200)
  t.is(res.body.length, t.context.people.length)
})

test('list everyone - admin user', async t => {
  // admin user
  const resAdmin = await request(server)
    .get('/api/people')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
  t.is(resAdmin.body.length, t.context.people.length)
})

test('list everyone - bad filter', async t => {
  // bad request
  const resBad = await request(server)
    .get('/api/people?q=thisisnotjson')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(resBad.status, 400)
})

test('list everyone - filtered, sorted, produced', async t => {
  // filtered & sorted request
  const resFilter = await request(server)
    .get('/api/people?q={"about":"Tester"}&s="phone"&p="nickname, phone"')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
  const testers = t.context.people.filter(p => p.about === 'Tester')
  t.is(resFilter.body.length, testers.length)
  t.is(resFilter.body[0].phone, testers[testers.length - 1].phone)
})

test('Get person by id', async t => {
  const p = t.context.people[2] // Testy A.
  const id = p._id
  // fetch the person - no auth
  await request(server)
    .get(`/api/people/${id}`)
    .set('Accept', 'application/json')
    .expect(403)

  // fetch the person - with auth
  const res = await request(server)
    .get(`/api/people/${id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)

  t.is(res.body.name, p.name)
  t.is(res.body.email, p.email)
})

test.serial('add a person', async t => {
  t.plan(5)

  const p = {
    name: 'Addy McAddFace',
    nickname: 'Addy',
    phone: '123 456789',
    email: 'addy@omgtech.co.nz',
    role: ['tester'],
    tags: []
  }
  try {
    // anon user can add a new person
    const res = await request(server)
      .post('/api/people')
      .send(p)
      .set('Accept', 'application/json')
      .expect(200)

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

test.serial('Should correctly add a person and sanitise inputs', async t => {
  t.plan(6)
  const p = {
    name: 'Bobby; DROP TABLES', // is allowed
    nickname: '<b>SQLINJECTOR</b>',
    phone: "1234<img src=x onerror=alert('img') />ABCD", // should remove img
    email: 'bobby@omgtech.co.nz', // ok
    about: "console.log('hello world')", // ok
    pronoun: { subject: 'they', object: 'them', possesive: 'ȁǹy' }, // ok
    role: ['tester'],
    tags: []
  }

  await request(server)
    .post('/api/people')
    .send(p)
    .set('Accept', 'application/json')
    .expect(200)

  const savedPerson = await Person.findOne({ email: p.email }).exec()
  t.deepEqual('1234ABCD', savedPerson.phone)
  t.deepEqual('Bobby; DROP TABLES', savedPerson.name)
  t.deepEqual(p.nickname, savedPerson.nickname)
  t.deepEqual(p.email, savedPerson.email)
  t.deepEqual(p.about, savedPerson.about)
  t.deepEqual(p.pronoun, savedPerson.pronoun)

  await Person.deleteOne({ email: p.email })
})

test.serial('Anon user cannot remove a user', async t => {
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

test('Should find a person by email', async t => {
  t.plan(1)
  const p = t.context.people[4]
  const email = p.email
  const res = await request(server)
    .get(`/api/person/by/email/${email}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
  t.is(res.body.name, p.name)
})

test('Should find a person by nickname', async t => {
  t.plan(1)
  const p = t.context.people[5]
  const res = await request(server)
    .get(`/api/person/by/nickname/${p.nickname}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200) // For now the tester ability is not proper defined so tester will have the same ability as admin
  t.is(res.body.name, p.name)
})

test.serial('Should find no person', async t => {
  t.plan(1)

  const res = await request(server)
    .get('/api/person/by/email/not_a_real_email@voluntarily.nz')
    .set('Accept', 'application/json')
    .expect(404)
  t.is(res.body.error, 'person not found')
})

test.serial('Should correctly handle missing inputs', async t => {
  const p = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    // email: 'Testy555@voluntarily.nz', <- explicity remove email
    role: ['tester'],
    tags: []
  }
  const res = await request(server)
    .post('/api/people')
    .send(p)
    .set('Accept', 'application/json')
    .expect(500)
  t.is(res.body.message, 'Person validation failed: email: Path `email` is required.')
  t.is(res.body.name, 'ValidationError')
})
