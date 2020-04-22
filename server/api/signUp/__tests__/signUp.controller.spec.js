import test from 'ava'
import MemoryMongo from '../../../util/test-memory-mongo'
import { updateRole, registerPerson } from '../signUp.controller'
import Person from '../../person/person'
import Response from 'mock-express-response'
import Request from 'mock-express-request'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test('updateRole', async (t) => {
  const me = {
    role: []
  }

  // add to empty array
  updateRole(me, true, 'volunteer')
  t.is(me.role.length, 1)
  t.true(me.role.includes('volunteer'))

  // add when already present doesn't add twice
  updateRole(me, true, 'volunteer')
  t.is(me.role.length, 1)
  t.true(me.role.includes('volunteer'))

  // add second value
  updateRole(me, true, 'basic')
  t.is(me.role.length, 2)
  t.true(me.role.includes('basic'))

  // add third value
  updateRole(me, true, 'fake')
  t.is(me.role.length, 3)
  t.true(me.role.includes('fake'))

  // remove second value
  updateRole(me, false, 'basic')
  t.is(me.role.length, 2)
  t.false(me.role.includes('basic'))

  // remove second value again
  updateRole(me, false, 'basic')
  t.is(me.role.length, 2)
  t.false(me.role.includes('basic'))

  // remove first value
  updateRole(me, false, 'volunteer')
  t.is(me.role.length, 1)
  t.false(me.role.includes('volunteer'))
})

test.serial('signUp  should update basic person role', async t => {
  const person = {
    name: 'Testy McTestface',
    email: 'testy@email.com',
    nickname: 'testy',
    role: []
  }

  const me = await Person.create(person)
  const res = new Response()
  const req = new Request()
  req.session = {
    isAuthenticated: true,
    me
  }
  req.body = {
    roleAsk: true,
    roleOffer: false,
    topicGroups: ['business']
  }

  await registerPerson(req, res)
  const newMe = await Person.findOne(me._id)
  t.true(newMe.role.includes('basic'))
  t.true(!newMe.role.includes('volunteer'))
  t.true(newMe.topicGroups.includes('business'))
})

test('signUp  should update volunteer person role', async t => {
  const person = {
    name: 'Testy McTestface',
    email: 'testy2@email.com',
    nickname: 'testy',
    role: []
  }

  const me = await Person.create(person)
  const res = new Response()
  const req = new Request()
  req.session = {
    isAuthenticated: true,
    me
  }
  req.body = {
    roleAsk: true,
    roleOffer: true,
    topicGroups: ['education', 'business']
  }

  await registerPerson(req, res)
  const newMe = await Person.findOne(me._id)
  t.true(newMe.role.includes('basic'))
  t.true(newMe.role.includes('volunteer'))
  t.true(newMe.topicGroups.includes('education'))
  t.true(newMe.topicGroups.includes('business'))
})

test('signUp  should remove volunteer person role', async t => {
  const person = {
    name: 'Testy McTestface',
    email: 'testy3@email.com',
    nickname: 'testy',
    role: ['volunteer']
  }

  const me = await Person.create(person)
  const res = new Response()
  const req = new Request()
  req.session = {
    isAuthenticated: true,
    me
  }
  req.body = {
    roleAsk: true,
    roleOffer: false
  }

  await registerPerson(req, res)
  const newMe = await Person.findOne(me._id)
  t.true(newMe.role.includes('basic'))
  t.true(!newMe.role.includes('volunteer'))
})

test('signUp  should update profile', async t => {
  const person = {
    name: 'Testy McTestface',
    email: 'testy4@email.com',
    nickname: 'testy',
    role: ['volunteer']
  }

  const me = await Person.create(person)
  const res = new Response()
  const req = new Request()
  req.session = {
    isAuthenticated: true,
    me
  }
  req.body = {
    roleAsk: true,
    roleOffer: false,
    person: {
      nickname: 'NewTesty',
      imgUrl: 'https://example.com/img.png',
      imgUrlSm: 'https://example.com/imgSm.png',
      locations: ['Auckland', 'Samantha']
    }
  }

  await registerPerson(req, res)
  const newMe = await Person.findOne(me._id)
  t.is(newMe.nickname, 'NewTesty')
  t.true(newMe.locations.includes('Samantha'))
})

test('signUp anon', async t => {
  const person = {
    name: 'Testy McTestface',
    email: 'testy5@email.com',
    nickname: 'testy',
    role: ['volunteer']
  }

  const me = await Person.create(person)
  const res = new Response()
  const req = new Request()
  req.session = {
    isAuthenticated: false,
    me
  }
  req.body = {
    roleAsk: true,
    roleOffer: false,
    person: {
      nickname: 'NewTesty',
      imgUrl: 'https://example.com/img.png',
      imgUrlSm: 'https://example.com/imgSm.png',
      locations: ['Auckland', 'Samantha']
    }
  }

  await registerPerson(req, res)
  t.is(res.statusCode, 403)
})
