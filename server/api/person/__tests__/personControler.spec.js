import test from 'ava'
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

test.failing('Try to update other people record without admin role', async t => {
  const userIDWantToUpdate = 'asdfasdfgadf'
  //   const userIDInSession = 'ads25145adsasdf'
  const rawRules = [
    { action: 'update', subject: 'Person', conditions: { _id: userIDWantToUpdate } }
  ]
  const ability = new Ability(rawRules)

  const request = new MockExpressRequest()

  request.ability = ability

  const response = MockResponse()

  await updatePersonDetail(request, response)

  t.fail()
})
