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

test.serial('Should call send status function for null record ', async t => {
  const userIDWantToUpdate = 'asdfasdfgadf'
  const fakeSendStatus =  sinon.fake()
  //   const userIDInSession = 'ads25145adsasdf'
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
  t.is(1,fakeSendStatus.callCount)
})
