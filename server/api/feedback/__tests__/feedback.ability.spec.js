import test from 'ava'
import MemoryMongo from '../../../util/test-memory-mongo'
import { server, appReady } from '../../../server'
import Feedback from '../feedback'
import { jwtDataDali as jwtVolunteer, jwtDataCharles as jwtOrgAdmin } from '../../../../server/middleware/session/__tests__/setSession.fixture'
import Person from '../../person/person'
import Activity from '../../activity/activity'
import ArchivedOpportunity from '../../archivedOpportunity/archivedOpportunity'
import { people, activities, archivedOpportunities, organisations, feedback, members, interestArchives } from './feedback.fixture'
import request from 'supertest'
import mongoose from 'mongoose'
import Member from '../../member/member'
import Organisation from '../../organisation/organisation'
import { InterestArchive } from '../../interest/interest'

test.before('Create a mock database and populate it with data', async t => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()

  await Person.create(people)
  await Organisation.create(organisations)
  await Member.create(members)
  await Activity.create(activities)
  await ArchivedOpportunity.create(archivedOpportunities)
  await Member.create(members)

  await appReady
})

test.beforeEach('Populate database with test data', async t => {
  await Feedback.create(feedback)
  await InterestArchive.create(interestArchives)
})

test.afterEach.always(async t => {
  await Feedback.deleteMany()
})

test.after.always(async t => {
  await t.context.memMongo.stop()
})

test.serial('Test anonymous user creates feedback should return 403', async t => {
  const newId = mongoose.Types.ObjectId()
  const payload = { ...feedback[0], _id: newId }
  const res = await request(server).post('/api/feedback').send(payload)

  t.is(res.status, 403)

  const savedFeedback = await Feedback.findOne({ _id: newId })
  t.falsy(savedFeedback)
})

test.serial('Test anonymous user listing feedback should return 403', async t => {
  const res = await request(server).get('/api/feedback')

  t.is(res.status, 403)
})

test.serial('Test anonymous user getting feedback should return 403', async t => {
  const res = await request(server).get(`/api/feedback/${feedback[0]._id}`)

  t.is(res.status, 403)
})

test.serial('Test anonymous user updating feedback should return 403', async t => {
  const payload = { ...feedback[0], rating: 5 }
  const res = await request(server).put(`/api/feedback/${payload._id}`).send(payload)

  t.is(res.status, 403)

  const savedFeedback = await Feedback.findOne({ _id: payload._id })
  t.truthy(savedFeedback)
  t.is(savedFeedback.rating, 2) // not updated
})

test.serial('Test anonymous user deleting feedback should return 403', async t => {
  const res = await request(server).delete(`/api/feedback/${feedback[0]._id}`)

  t.is(res.status, 403)

  const savedFeedback = await Feedback.findOne({ _id: feedback[0]._id })
  t.truthy(savedFeedback) // should not be deleted
})

test.serial('Test volunteer creates feedback for other person should return 403', async t => {
  const newId = mongoose.Types.ObjectId()
  const payload = { ...feedback[0], _id: newId } // respondent is not himself
  const res = await request(server).post('/api/feedback').send(payload).set('Cookie', [`idToken=${jwtVolunteer.idToken}`])

  t.is(res.status, 403)

  const savedFeedback = await Feedback.findOne({ _id: newId })
  t.falsy(savedFeedback)
})

test.serial('Test volunteer creates feedback for event they did not attend return 403', async t => {
  await InterestArchive.deleteMany() // delete all so volunteer has no longer attended the opportunity

  const newId = mongoose.Types.ObjectId()
  const payload = { ...feedback[1], _id: newId }

  const res = await request(server).post('/api/feedback').send(payload).set('Cookie', [`idToken=${jwtVolunteer.idToken}`])

  t.is(res.status, 403)

  const savedFeedback = await Feedback.findOne({ _id: newId })
  t.falsy(savedFeedback)
})

test.serial('Test volunteer listing feedback should return only his feedback', async t => {
  const res = await request(server).get('/api/feedback').set('Cookie', [`idToken=${jwtVolunteer.idToken}`])

  t.is(res.status, 200)
  t.true(Array.isArray(res.body))
  res.body.forEach(f => t.is(f.respondent, people[1]._id.toString())) // all returned entries are for himself
})

test.serial('Test volunteer getting other users feedback should return 404', async t => {
  const res = await request(server).get(`/api/feedback/${feedback[0]._id}`).set('Cookie', [`idToken=${jwtVolunteer.idToken}`])

  // volunteer shouldnt be indicated that the forbidden resource exists
  t.is(res.status, 404)
})

test.serial('Test volunteer updating other users feedback should return 404', async t => {
  const payload = { ...feedback[0], rating: 5 }
  const res = await request(server).put(`/api/feedback/${payload._id}`).send(payload).set('Cookie', [`idToken=${jwtVolunteer.idToken}`])

  // volunteer shouldnt be indicated that the forbidden resource exists
  t.is(res.status, 404)

  const savedFeedback = await Feedback.findOne({ _id: payload._id })
  t.truthy(savedFeedback)
  t.is(savedFeedback.rating, 2) // not updated
})

test.serial('Test volunteer updating their feedback to an event they did not attend should return 403', async t => {
  await InterestArchive.deleteMany() // delete all so volunteer has no longer attended the opportunity

  const payload = { ...feedback[1], rating: 5 }
  const res = await request(server).put(`/api/feedback/${payload._id}`).send(payload).set('Cookie', [`idToken=${jwtVolunteer.idToken}`])

  // volunteer shouldnt be indicated that the forbidden resource exists
  t.is(res.status, 403)

  const savedFeedback = await Feedback.findOne({ _id: payload._id })
  t.truthy(savedFeedback)
  t.is(savedFeedback.rating, 3) // not updated
})

test.serial('Test volunteer deleting feedback should return 403', async t => {
  const res = await request(server).delete(`/api/feedback/${feedback[0]._id}`).set('Cookie', [`idToken=${jwtVolunteer.idToken}`])

  // volunteers are not allowed to delete feedback at all
  t.is(res.status, 403)

  const savedFeedback = await Feedback.findOne({ _id: feedback[0]._id })
  t.truthy(savedFeedback) // should not be deleted
})

test.serial('Test volunteer creates feedback for himself should return 201', async t => {
  const newId = mongoose.Types.ObjectId()
  const payload = { ...feedback[1], _id: newId } // respondent is himself
  const res = await request(server).post('/api/feedback').send(payload).set('Cookie', [`idToken=${jwtVolunteer.idToken}`])

  t.is(res.status, 201)

  const savedFeedback = await Feedback.findOne({ _id: newId })
  t.truthy(savedFeedback)
  t.deepEqual(savedFeedback._id, newId)
})

test.serial('Test volunteer getting own feedback should return 200', async t => {
  const res = await request(server).get(`/api/feedback/${feedback[1]._id}`).set('Cookie', [`idToken=${jwtVolunteer.idToken}`])

  t.is(res.status, 200)
  t.is(res.body._id, feedback[1]._id.toString())
  t.is(res.body.rating, feedback[1].rating)
})

test.serial('Test volunteer updating own feedback should return 200', async t => {
  const payload = { ...feedback[1], rating: 5 }
  const res = await request(server).put(`/api/feedback/${payload._id}`).send(payload).set('Cookie', [`idToken=${jwtVolunteer.idToken}`])

  t.is(res.status, 200)

  const savedFeedback = await Feedback.findOne({ _id: payload._id })
  t.truthy(savedFeedback)
  t.is(savedFeedback.rating, 5) // updated
})

test.serial('Test org admin listing feedback should return only feedback from his org', async t => {
  const res = await request(server).get('/api/feedback').set('Cookie', [`idToken=${jwtOrgAdmin.idToken}`])

  t.is(res.status, 200)
  t.true(Array.isArray(res.body))
  res.body.forEach(f => t.true(f.respondentOrgs.includes(members[0].organisation.toString()))) // all returned entries are from his org
})

test.serial('Test org admin getting other organisations feedback should return 404', async t => {
  const res = await request(server).get(`/api/feedback/${feedback[0]._id}`).set('Cookie', [`idToken=${jwtOrgAdmin.idToken}`])

  // orgAdmin shouldnt be indicated that the forbidden resource exists
  t.is(res.status, 404)
})

test.serial('Test org admin getting own organisations feedback should return 200', async t => {
  const res = await request(server).get(`/api/feedback/${feedback[1]._id}`).set('Cookie', [`idToken=${jwtOrgAdmin.idToken}`])

  t.is(res.status, 200)
  t.true(res.body.respondentOrgs.includes(members[0].organisation.toString()))
})
