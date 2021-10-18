import test from 'ava'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import { server, appReady } from '../../../server'
import Feedback from '../feedback'
import { jwtData } from '../../../../server/middleware/session/__tests__/setSession.fixture'
import Person from '../../person/person'
import Activity from '../../activity/activity'
import ArchivedOpportunity from '../../archivedOpportunity/archivedOpportunity'
import { people, activities, archivedOpportunities, feedback, organisations, members, interestArchives } from './feedback.fixture'
import request from 'supertest'
import mongoose from 'mongoose'
import Organisation from '../../organisation/organisation'
import Member from '../../member/member'
import { InterestArchive } from '../../interest/interest'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('Create a mock database and populate it with data', async t => {
  await Person.create(people)
  await Organisation.create(organisations)
  await Member.create(members)
  await Activity.create(activities)
  await ArchivedOpportunity.create(archivedOpportunities)
  await InterestArchive.create(interestArchives)

  await appReady
})

test.beforeEach('Populate database with test data', async t => {
  await Feedback.create(feedback)
})

test.afterEach.always(async t => {
  await Feedback.deleteMany()
})

test.serial('Test create valid feedback should return 201', async t => {
  await Feedback.deleteMany() // clear existing feedback to avoid conflicts

  const newId = mongoose.Types.ObjectId()
  const payload = { ...feedback[0], _id: newId }
  const res = await request(server).post('/api/feedback').send(payload).set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 201)

  const savedFeedback = await Feedback.findOne({ _id: newId })
  t.truthy(savedFeedback)
  t.is(savedFeedback.rating, 2)
})

test.serial('Test create invalid feedback should return 400', async t => {
  await Feedback.deleteMany() // clear existing feedback to avoid conflicts

  const payload = { respondent: people[0]._id, opportunity: archivedOpportunities[0]._id, rating: 'abc' } // invalid object
  const res = await request(server).post('/api/feedback').send(payload).set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 400)
})

test.serial('Test create duplicate feedback should return 409', async t => {
  const newId = mongoose.Types.ObjectId()
  const payload = { ...feedback[0], _id: newId } // duplicate for person x opportunity
  const res = await request(server).post('/api/feedback').send(payload).set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 409)

  const savedFeedback = await Feedback.findOne({ _id: newId })
  t.falsy(savedFeedback)
})

test.serial('Test list feedback without query should return 200', async t => {
  const res = await request(server).get('/api/feedback').set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)
  t.true(Array.isArray(res.body))
  t.is(res.body.length, feedback.length)
})

test.serial('Test list feedback with valid query should return 200', async t => {
  const q = JSON.stringify({ rating: 2 })
  const res = await request(server).get('/api/feedback').query({ q }).set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)
  t.true(Array.isArray(res.body))
  res.body.forEach(f => t.is(f.rating, 2))
})

test.serial('Test list feedback with invalid query should return 400', async t => {
  const q = 'apples'
  const res = await request(server).get('/api/feedback').query({ q }).set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 400)
})

test.serial('Test get feedback with valid id should return 200', async t => {
  const res = await request(server).get(`/api/feedback/${feedback[0]._id}`).set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)
  t.is(res.body._id, feedback[0]._id.toString())
  t.is(res.body.rating, feedback[0].rating)
})

test.serial('Test get feedback with invalid id should return 404', async t => {
  const res = await request(server).get(`/api/feedback/${mongoose.Types.ObjectId()}`).set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 404)
})

test.serial('Test update valid feedback should return 200', async t => {
  const payload = { ...feedback[0], rating: 5 }
  const res = await request(server).put(`/api/feedback/${payload._id}`).send(payload).set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)
  t.is(res.body.rating, 5)

  const savedFeedback = await Feedback.findOne({ _id: payload._id })
  t.truthy(savedFeedback)
  t.is(savedFeedback.rating, 5)
})

test.serial('Test update invalid feedback should return 400', async t => {
  const payload = { ...feedback[0], rating: 'apples' }
  const res = await request(server).put(`/api/feedback/${payload._id}`).send(payload).set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 400)
  const savedFeedback = await Feedback.findOne({ _id: payload._id })
  t.truthy(savedFeedback)
  t.is(savedFeedback.rating, 2) // not updated in db
})

test.serial('Test update invalid id should return 404', async t => {
  const payload = { ...feedback[0], rating: 5, _id: mongoose.Types.ObjectId() }
  const res = await request(server).put(`/api/feedback/${payload._id}`).send(payload).set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 404)

  const savedFeedback = await Feedback.findOne({ _id: feedback[0]._id })
  t.truthy(savedFeedback)
  t.is(savedFeedback.rating, 2) // not updated in db
})

test.serial('Test delete valid id should return 204', async t => {
  const res = await request(server).delete(`/api/feedback/${feedback[0]._id}`).set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 204)

  const savedFeedback = await Feedback.findOne({ _id: feedback[0]._id })
  t.falsy(savedFeedback) // should be deleted
})

test.serial('Test delete invalid id should return 404', async t => {
  const res = await request(server).delete(`/api/feedback/${mongoose.Types.ObjectId()}`).set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 404)

  const savedFeedback = await Feedback.findOne({ _id: feedback[0]._id })
  t.truthy(savedFeedback) // should not be deleted
})
