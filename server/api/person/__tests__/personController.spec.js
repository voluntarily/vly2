import test from 'ava'
import sinon from 'sinon'
import { Ability } from '@casl/ability'
import { appReady } from '../../../server'
import Person from '../person'
import MockExpressRequest from 'mock-express-request'
import MockResponse from 'mock-res'
import { updatePersonDetail } from '../person.controller'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from '../__tests__/person.fixture'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
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

test.serial('Should call send status function for null record ', async t => {
  const userIDWantToUpdate = 'asdfasdfgadf'
  const fakeSendStatus = sinon.fake()
  const rawRules = [
    { action: 'update', subject: 'Person', conditions: { _id: userIDWantToUpdate } }
  ]
  const ability = new Ability(rawRules)

  const request = new MockExpressRequest()
  request.body = {
    _id: '5d48f775741eab0d344d4c29'
  }
  request.ability = ability

  const response = new MockResponse()
  response.sendStatus = (status) => { fakeSendStatus() }
  await updatePersonDetail(request, response)
  t.is(1, fakeSendStatus.callCount)
})

test.serial('Should call next middleware when record is found', async t => {
  const personToQuery = await Person.find({ name: 'Andrew Watkins' })
  const idToQuery = personToQuery[0]._id

  const fakeSendStatus = sinon.fake()
  const nextMiddleware = sinon.fake()
  const rawRules = [
    { action: 'manage', subject: 'Person' }
  ]
  const ability = new Ability(rawRules)

  const request = new MockExpressRequest()
  request.body = {
    _id: idToQuery,
    name: 'Andrew Watkins',
    nickname: 'avowkind',
    email: 'andrew@groat.nz',
    about: 'Voluntari.ly Product Lead',
    location: 'Auckland',
    gender: 'male',
    language: 'EN',
    role: [
      'admin'
    ],
    status: 'active',
    imgUrl: 'https://avatars2.githubusercontent.com/u/1596437?v=4',
    phone: '+64 027 7031007'
  }
  request.ability = ability
  request.crudify = {
    result: {}
  }
  const response = new MockResponse()
  response.sendStatus = (status) => { fakeSendStatus() }
  await updatePersonDetail(request, response, nextMiddleware)
  t.is(1, nextMiddleware.callCount)
  t.deepEqual(request.crudify.result, request.body)
})
