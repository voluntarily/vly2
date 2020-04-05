import test from 'ava'
import sinon from 'sinon'
import * as _ from 'lodash'
import { config } from '../../../../config/serverConfig'
import fetchMock from 'fetch-mock'
import { initVerify, verifyLiveCallback } from '../personalVerification.controller'
import MockResponse from 'mock-res'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import MockExpressRequest from 'mock-express-request'
import MemoryMongo from '../../../util/test-memory-mongo'
import { liveInitResponseError, liveInitResponseSuccess, liveResponseSuccess, verifyResponseData } from './personalVerification.cloudcheck.fixture'
const { PersonFields } = require('../../person/person.constants')
const { PersonalVerificationStatus, ErrorRedirectUrlQuery } = require('./../personalVerification.constants')
const { PersonalVerification } = require('./../personalVerification')


const verificationErrorRedirectUrl = `${config.appUrl}/home?tab=profile&${ErrorRedirectUrlQuery}`

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

test.serial('initVerify should redirect with verification error if person has no session', async t => {
  const fakeRedirect = sinon.fake()
  const response = new MockResponse()
  response.redirect = (url) => { fakeRedirect(url) }

  const request = new MockExpressRequest()
  request.session = {}

  await initVerify({ session: {} }, response)
  t.is(1, fakeRedirect.callCount)
  t.is(verificationErrorRedirectUrl, fakeRedirect.lastArg)
})

test.serial('initVerify should redirect with verification error if person is not found', async t => {
  const fakeRedirect = sinon.fake()
  const response = new MockResponse()
  response.redirect = (url) => { fakeRedirect(url) }

  const request = new MockExpressRequest()
  request.session = {
    me: 'asdfasdfadsf'
  }

  await initVerify(request, response)
  t.is(1, fakeRedirect.callCount)
  t.is(verificationErrorRedirectUrl, fakeRedirect.lastArg)
})

test.serial('initVerify should redirect with verification error if cloudcheck returns an error', async t => {
  await Person.create(people).catch((err) => console.error('Unable to create people:', err))
  const fakeRedirect = sinon.fake()
  const response = new MockResponse()
  response.redirect = (url) => { fakeRedirect(url) }

  response.json = (json) => { fakeJson(json) }
  t.context.mockServer.post(`${config.verification.cloudcheck.url}/live/`, liveInitResponseError)

  const personToQuery = await Person.find({ name: people[0].name })
  const idToQuery = personToQuery[0]._id

  const request = new MockExpressRequest()
  request.session = {
    me: idToQuery
  }

  await initVerify(request, response)
  t.is(1, fakeRedirect.callCount)
  t.is(verificationErrorRedirectUrl, fakeRedirect.lastArg)
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

test.serial('verifyLiveCallback works', async t => {
  const liveCaptured = 'live-capture'
  const liveToken = 'live-token'
  const captureReference = 'capture-reference'
  const voluntarilyReference = 'voluntarily-reference'

  const liveResponseData = _.cloneDeep(liveResponseSuccess)
  liveResponseData.body.capture.reference = voluntarilyReference

  t.context.mockServer.get(/live\/response/, liveResponseData)
  t.context.mockServer.post(/verify/, verifyResponseData)

  const response = new MockResponse()
  const fakeRedirect = sinon.fake()
  response.redirect = (url) => fakeRedirect(url)

  const testPerson = await Person.create(people[1]).catch((err) => console.error('Unable to create people:', err))

  const personalVerification = await new PersonalVerification({
    person: testPerson,
    voluntarilyReference,
    captureReference,
    status: PersonalVerificationStatus.IN_PROGRESS
  }).save()

  const request = {
    query: {
      liveReference: voluntarilyReference,
      liveToken,
      liveCaptured,
      captureReference

    }
  }

  await verifyLiveCallback(request, response)

  t.is(1, fakeRedirect.callCount)
  t.is(`${config.appUrl}/home?tab=profile`, fakeRedirect.lastArg)

  const updatedPerson = await Person.findById(testPerson._id)
  const verificationReference = verifyResponseData.body.verification.verificationReference
  t.is(PersonalVerificationStatus.VERIFIED, updatedPerson.verified.find(v => v.name === PersonFields.NAME).status)
  t.is(PersonalVerificationStatus.VERIFIED, updatedPerson.verified.find(v => v.name === PersonFields.ADDRESS).status)
  t.is(PersonalVerificationStatus.VERIFIED, updatedPerson.verified.find(v => v.name === PersonFields.DOB).status)
  t.is(verificationReference, updatedPerson.verified.find(v => v.name === PersonFields.NAME).verificationReference)
  t.is(verificationReference, updatedPerson.verified.find(v => v.name === PersonFields.ADDRESS).verificationReference)
  t.is(verificationReference, updatedPerson.verified.find(v => v.name === PersonFields.DOB).verificationReference)

  const updatedPersonalVerification = await PersonalVerification.findById(personalVerification._id)
  t.is(PersonalVerificationStatus.VERIFIED, updatedPersonalVerification.status)
  t.is(verificationReference, updatedPersonalVerification.verificationReference)
  t.deepEqual(verifyResponseData.body, updatedPersonalVerification.verificationObject)
})
