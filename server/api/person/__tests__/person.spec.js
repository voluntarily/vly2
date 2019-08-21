import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Person from '../person'

import MemoryMongo from '../../../util/test-memory-mongo'
import people from '../__tests__/person.fixture'

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  // console.log('App ready')
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add people fixture', async () => {
  await Person.create(people).catch((err) => `Unable to create people: ${err}`)
})

test.afterEach.always(async () => {
  await Person.deleteMany()
})

test.serial('verify fixture database has people', async t => {
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

test.serial('Should correctly block GET method for api people for anonymous', async t => {
  const res = await request(server)
    .get('/api/people')
    .set('Accept', 'application/json')
    .expect(403)

  t.is(undefined, res.body.length) // Return data response will be undefined for 403 response
})

test.failing('Should send correct data when queried against an id', async t => {
  t.plan(1)
  const p = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    email: 'query@omgtech.co.nz',
    role: ['tester'],
    tags: []
  }

  const person = new Person(p)
  await person.save()
  const id = person._id

  const res = await request(server)
    .get(`/api/people/${id}`)
    .set('Accept', 'application/json')
    // .expect('Content-Type', /json/)
    .expect(403)
  t.is(res.body.name, p.name)
})

test.serial('Should correctly add a person', async t => {
  t.plan(3)

  const p = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    email: 'addy@omgtech.co.nz',
    gender: 'binary',
    role: ['tester'],
    tags: []
  }

  const res = await request(server)
    .post('/api/people')
    .send(p)
    .set('Accept', 'application/json')
    .expect(200)

  try {
  // can find by id
    const id = res.body._id
    await Person.findById(id).then((person) => {
    // console.log('findById:', person)
      t.is(id, person._id.toString())
    })

    // can find by email with then
    await Person.findOne({ email: p.email }).then((person) => {
      t.is(person.name, p.name)
    })

    // can find by email using await
    const savedPerson = await Person.findOne({ email: p.email }).exec()
    t.is(savedPerson.name, p.name)
  } catch (err) {
    console.log(err)
  }
})

test.serial('Should correctly add a person and sanitise inputs', async t => {
  const p = {
    name: 'Bobby; DROP TABLES', // is allowed
    nickname: '<b>SQLINJECTOR</b>',
    phone: "1234<img src=x onerror=alert('img') />ABCD", // should remove img
    email: 'bobby@omgtech.co.nz', // ok
    gender: "console.log('hello world')", // ok
    role: ['tester'],
    tags: []
  }

  await request(server)
    .post('/api/people')
    .send(p)
    .set('Accept', 'application/json')
    .expect(200)

  const savedPerson = await Person.findOne({ email: p.email }).exec()
  t.is(savedPerson.phone, '1234ABCD')
})

test.serial('Should load a person into the db but block access and delete them via the api', async t => {
  t.plan(4)
  const p = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    email: 'loady@omgtech.co.nz',
    gender: 'binary',
    role: ['tester'],
    tags: []
  }
  const person = new Person(p)
  await person.save()
  const id = person._id

  const res = await request(server)
    .get(`/api/people/${id}`)
    .set('Accept', 'application/json')
    .expect(403)

  t.is(res.body.name, undefined)

  // delete the record
  await request(server)
    .delete(`/api/people/${person._id}`)
    .set('Accept', 'application/json')
    .expect(403)

  // check person is still in the database
  const queriedPerson = await Person.findOne({ email: p.email }).exec()
  t.is(queriedPerson.name, p.name)
  t.is(queriedPerson.email, p.email)
  t.is(queriedPerson.phone, p.phone)
})

test.serial('Should find a person by email', async t => {
  t.plan(1)
  const p = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    email: 'unique_email@voluntarily.nz',
    role: ['tester'],
    tags: []
  }

  const person = new Person(p)
  await person.save()
  const email = p.email
  // console.log('asking for ', `/api/people/email/${email}`)
  const res = await request(server)
    .get(`/api/person/by/email/${email}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
  // console.log(res.body)
  t.is(res.body.name, p.name)
})

test.serial('Should find a person by nickname', async t => {
  t.plan(1)
  const p = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    email: 'Testy555@voluntarily.nz',
    role: ['tester'],
    tags: []
  }

  const person = new Person(p)
  await person.save()
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
    .get(`/api/person/by/email/not_a_real_email@voluntarily.nz`)
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
  try {
    const res = await request(server)
      .post('/api/people')
      .send(p)
      .set('Accept', 'application/json')
      .expect(200)
    // console.log(res.body)
    t.is(res.body.message, 'Person validation failed: email: Path `email` is required.')
    t.is(res.body.name, 'ValidationError')
  } catch (err) {
    console.log('api/people', err)
  }
})
