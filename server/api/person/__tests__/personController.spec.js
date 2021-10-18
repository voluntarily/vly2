import test from 'ava'
import sinon from 'sinon'
import { Ability } from '@casl/ability'
import { appReady } from '../../../server'
import Person from '../person'
import MockExpressRequest from 'mock-express-request'
import MockResponse from 'mock-res'
import { updatePersonDetail } from '../person.controller'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import people from '../__tests__/person.fixture'
import { Role } from '../../../../server/services/authorize/role'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  try {
    await appReady
    await Person.create(people).catch((err) => console.error('Unable to create people:', err))
  } catch (e) {
    console.error('personController.spec.js, before connect to database', e)
  }
})

test.serial('Should call sendStatus function for null record ', async t => {
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
    about: 'New About Text',
    locations: ['Auckland'],
    language: 'en',
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
  request.session = {
    me: {
      _id: idToQuery,
      role: [Role.ADMIN]
    }
  }
  request.params = {
    _id: idToQuery.toString()
  }

  const response = new MockResponse()
  response.sendStatus = (status) => { fakeSendStatus() }
  await updatePersonDetail(request, response, nextMiddleware)

  t.is(1, nextMiddleware.callCount)
  t.is(request.crudify.result.about, request.body.about)
})
