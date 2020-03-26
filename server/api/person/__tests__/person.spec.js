import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Person from '../person'
const { PersonCategory } = require('./person.constants')
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from '../__tests__/person.fixture'
import objectid from 'objectid'
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

test('Get person who doesnt exist', async t => {
  // fetch the person - no auth
  const notPersonId = objectid().toString()
  const res = await request(server)
    .get(`/api/people/${notPersonId}`)
    .set('Accept', 'application/json')

  t.is(res.status, 404)
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
    category: [PersonCategory.ESSENTIAL_SERVICE],
    tags: []
  }

  await request(server)
    .post('/api/people')
    .send(p)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
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

test('Should correctly handle missing inputs', async t => {
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

test.serial('Email notifications flag set correctly', async (t) => {
  const people = await Person.create([
    {
      name: 'Test default flag',
      email: 'test1@example.com'
    },
    {
      name: 'Test true flag',
      email: 'test2@example.com',
      sendEmailNotifications: true
    },
    {
      name: 'Test false flag',
      email: 'test3@example.com',
      sendEmailNotifications: false
    }
  ])

  t.is(people[0].sendEmailNotifications, true)
  t.is(people[1].sendEmailNotifications, true)
  t.is(people[2].sendEmailNotifications, false)

  await Person.remove({ _id: { $in: people.map(person => person._id) } })
})
