import test from 'ava'
import sinon from 'sinon'
import { config } from '../../../../config/serverConfig'
import fetchMock from 'fetch-mock'
import { initVerify } from '../personalVerification.controller'
import MockResponse from 'mock-res'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import MockExpressRequest from 'mock-express-request'
import MemoryMongo from '../../../util/test-memory-mongo'
import { liveInitResponseError, liveInitResponseSuccess } from './personalVerification.cloudcheck.fixture'
const { PersonFields } = require('../../person/person.constants')
const { PersonalVerificationStatus } = require('./../personalVerification.constants')
const { PersonalVerification } = require('./../personalVerification')

test.before('before connect to database', async (t) => {
  try {
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
  } catch (e) {
    console.error('personalVerification.controller.spec.js, before connect to database', e)
  }
  t.context.mockServer = fetchMock.sandbox()
  global.fetch = t.context.mockServer
})

test.afterEach.always(async t => {
  t.context.mockServer.reset()
  await Person.remove()
  await PersonalVerification.remove()
})

test.serial('initVerify should return 401 if person has no session', async t => {
  const fakeSendStatus = sinon.fake()
  const response = new MockResponse()
  response.sendStatus = (status) => { fakeSendStatus(status) }

  const request = new MockExpressRequest()
  request.session = {}

  await initVerify({ session: {} }, response)
  t.is(1, fakeSendStatus.callCount)
  t.is(401, fakeSendStatus.lastArg)
})

test.serial('initVerify should return 404 if person is not found', async t => {
  const fakeSendStatus = sinon.fake()
  const response = new MockResponse()
  response.sendStatus = (status) => { fakeSendStatus(status) }

  const request = new MockExpressRequest()
  request.session = {
    me: 'asdfasdfadsf'
  }

  await initVerify(request, response)
  t.is(1, fakeSendStatus.callCount)
  t.is(404, fakeSendStatus.lastArg)
})

test.serial('initVerify should return 401 if cloudcheck returns an error', async t => {
  await Person.create(people).catch((err) => console.error('Unable to create people:', err))
  const fakeStatus = sinon.fake()
  const fakeJson = sinon.fake()
  const response = new MockResponse()
  response.status = (status) => {
    fakeStatus(status)
    return response
  }
  response.json = (json) => { fakeJson(json) }
  t.context.mockServer.post(`${config.verification.cloudcheck.url}/live/`, liveInitResponseError)

  const personToQuery = await Person.find({ name: people[0].name })
  const idToQuery = personToQuery[0]._id

  const request = new MockExpressRequest()
  request.session = {
    me: idToQuery
  }

  await initVerify(request, response)
  t.is(1, fakeStatus.callCount)
  t.is(401, fakeStatus.lastArg)
  t.is(1, fakeJson.callCount)
})

test.serial('initVerify should update person, personal verification and redirect if everything works', async t => {
  const testPerson = await Person.create(people[1]).catch((err) => console.error('Unable to create people:', err))
  const fakeRedirect = sinon.fake()
  const response = new MockResponse()
  response.redirect = (url) => fakeRedirect(url)
  t.context.mockServer.post(`${config.verification.cloudcheck.url}/live/`, liveInitResponseSuccess)
  const request = new MockExpressRequest()
  request.session = {
    me: testPerson._id
  }

  await initVerify(request, response)

  t.is(1, fakeRedirect.callCount)
  t.is(liveInitResponseSuccess.body.capture.url, fakeRedirect.lastArg)

  const updatedPerson = await Person.findById(testPerson._id)
  t.is(PersonalVerificationStatus.IN_PROGRESS, updatedPerson.verified.find(v => v.name === PersonFields.NAME).status)
  t.is(PersonalVerificationStatus.IN_PROGRESS, updatedPerson.verified.find(v => v.name === PersonFields.ADDRESS).status)
  t.is(PersonalVerificationStatus.IN_PROGRESS, updatedPerson.verified.find(v => v.name === PersonFields.DOB).status)
})
