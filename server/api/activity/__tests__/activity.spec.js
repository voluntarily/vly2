import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Activity from '../activity'
import Person from '../../person/person'
import Organisation from '../../organisation/organisation'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from '../../person/__tests__/person.fixture'
import orgs from '../../organisation/__tests__/organisation.fixture'
import tagList from '../../tag/__tests__/tag.fixture'
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'
import { getBucketName } from '../../file/file.controller'

import acts from './activity.fixture.js'
import { v4 as uuid } from 'uuid'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.orgs = await Organisation.create(orgs).catch((err) => `Unable to create organisations: ${err}`)

  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add two activity entries', async (t) => {
  // connect each activity to an owner and org
  acts.forEach((act, index) => {
    act.owner = t.context.people[index]._id
    act.offerOrg = t.context.orgs[index]._id
    // each act has two consecutive tags from the list
    act.tags = [tagList[index], tagList[index + 1]]
  })

  t.context.activities = await Activity.create(acts).catch((err) => console.error('Unable to create activities', err))
})

test.afterEach.always(async () => {
  await Activity.deleteMany()
})

test.serial('verify fixture database has acts', async t => {
  const count = await Activity.countDocuments()
  t.is(count, t.context.activities.length)
  // can find all
  const p = await Activity.find()
  t.is(t.context.activities.length, p.length)

  // can find by things
  const q = await Activity.findOne({ name: '4 The first 100 metres' })
  t.is(q && q.duration, '2 hours')
  t.is(q.slug, '4-the-first-100-metres')
})

test.serial('Should correctly give count of all acts sorted by name', async t => {
  const res = await request(server)
    .get('/api/activities')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(t.context.activities.length, got.length)

  t.is(got[0].name, acts[0].name)
})

test.serial('Get an invalid activity id', async t => {
  const res = await request(server)
    .get(`/api/activities/${t.context.people[0]._id}`)
    .set('Accept', 'application/json')
    .expect(404)
    // .expect('Content-Type', /json/)
  t.is(res.status, 404)
})

test.serial('Should correctly give subset of acts matching status', async t => {
  const res = await request(server)
    .get('/api/activities?q={"status":"draft"}')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 2)
})

test.serial('Should correctly select just the titles and ids', async t => {
  const res = await request(server)
    .get('/api/activities?p={"name": 1}')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, t.context.activities.length)
  t.is(got[0].status, undefined)
  t.is(got[0].name, acts[0].name)
})

test.only('Should correctly list active acts with counts', async t => {
  const res = await request(server)
    .get('/api/activities')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, t.context.activities.length)
  t.is(got[0].name, acts[0].name)
  t.deepEqual(got[0].opCounts, { ask: 0, offer: 0 })
})

test.serial('Should correctly give number of active activities', async t => {
  const res = await request(server)
    .get('/api/activities?q={"status": "active"}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    // .expect('Content-Length', '2')
  const got = res.body

  t.deepEqual(3, got.length)
})

test.serial('Should send correct data when queried against an _id', async t => {
  t.plan(2)

  const act1 = t.context.activities[1]
  const person1 = t.context.people[1]
  const res = await request(server)
    .get(`/api/activities/${act1._id}`)
    .set('Accept', 'application/json')
    .expect(200)
  t.is(res.body.name, act1.name)
  // verify owner was populated out
  t.is(res.body.owner.name, person1.name)
})

test.serial('Should not find invalid _id', async t => {
  const res = await request(server)
    .get('/api/activities/5ce8acae1fbf56001027b254')
    .set('Accept', 'application/json')
  t.is(res.status, 404)
})

// test.serial('Should correctly add an activity', async t => {
test.serial('activetest', async t => {
  t.plan(2)

  const res = await request(server)
    .post('/api/activities')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({
      name: 'The first 400 metres',
      subtitle: 'Launching into space step 3',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours'
    })
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const savedActivity = await Activity.findOne({ name: 'The first 400 metres' }).exec()
  t.is(savedActivity.subtitle, 'Launching into space step 3')
})

test.serial('Should correctly add an activity with default image', async t => {
  t.plan(3)

  const res = await request(server)
    .post('/api/activities')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({
      name: 'The first 400 metres',
      subtitle: 'Launching into space step 3',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours'
    })
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const savedActivity = await Activity.findOne({ name: 'The first 400 metres' }).exec()
  t.is(savedActivity.subtitle, 'Launching into space step 3')

  // activity has been given the default image
  t.is(savedActivity.imgUrl, '/static/img/activity/activity.png')
})

test('Should correctly update an activity', async t => {
  t.plan(2)

  const sky1 = {
    name: 'The first 1000 metres',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours'
  }
  const activity = new Activity(sky1)
  await activity.save()

  // change the name - the slug should update
  activity.name = 'The sky is the limit'
  const res = await request(server)
    .put(`/api/activities/${activity._id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send(activity)
    .set('Accept', 'application/json')
  t.is(res.status, 200)
  t.is(res.body.name, activity.name)
})

test.serial('Should correctly delete an activity', async t => {
  t.plan(2)

  const activity = new Activity({
    _id: '5cc8d60b8b16812b5b3920c3',
    name: 'The first 1000 metres',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours'
  })
  await activity.save()

  const res = await request(server)
    .delete(`/api/activities/${activity._id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const queriedActivity = await Activity.findOne({ _id: activity._id }).exec()
  t.is(queriedActivity, null)
})

// Searching by something in the name (case insensitive)
test.serial('Should correctly give activity 3 when searching by "garden"', async t => {
  const res = await request(server)
    .get('/api/activities?search=GarDen')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(1, got.length)
  t.is(acts[3].name, got[0].name)
})

// Searching by something in the name (case insensitive)
test.serial('Should redirect when using slug', async t => {
  const slug = '5-going-to-the-moon'
  const res = await request(server)
    .get(`/activity/${slug}`)
    .set('Accept', 'application/json')
  t.is(res.status, 307)
  t.is(res.headers.location, `/acts/${t.context.activities[2]._id}`)
})

test.serial('Should 404 when using bad slug', async t => {
  const slug = 'xxxxx'
  const res = await request(server)
    .get(`/activity/${slug}`)
    .set('Accept', 'application/json')
  t.is(res.status, 404)
})

// Searching for something in the description (case insensitive)
test.serial('Should correctly give activity 2 when searching by "Algorithms"', async t => {
  const res = await request(server)
    .get('/api/activities?search=AlgorithMs')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(1, got.length)
  t.is(acts[1].name, got[0].name)
  t.falsy(got[0].description) // should only get summary fields
})

test.serial('Should correctly give activity 1 when searching by Organization', async t => {
  const targetOrg = t.context.orgs[1].name // OMGTech
  const res = await request(server)
    .get(`/api/activities?search=${targetOrg}`)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got[0].name, t.context.activities[1].name)
  t.is(1, got.length)
})

test.serial('Should correctly give 2 activities when searching by Tags', async t => {
  const res = await request(server)
    .get(`/api/activities?search=${tagList[2]}`)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 2)
  t.is(got[0].name, acts[1].name)
  t.is(got[1].name, acts[2].name)
})

test.serial('Should find no matches', async t => {
  const res = await request(server)
    .get('/api/activities?q={"name":"nomatches"}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 0)
})

test.serial('Should fail to find - invalid query', async t => {
  const res = await request(server)
    .get('/api/activities?s={"invalid":"nomatches"}')
    .set('Accept', 'application/json')
    .expect(404)
  t.is(res.status, 404)
})

test.serial('Should return any activities with matching tags or name/desc/subtitle', async t => {
  // assign tags to activities
  t.context.activities[2].tags = ['java', 'robots']
  t.context.activities[0].tags = ['java']
  t.context.activities[1].tags = ['robots']

  await Promise.all([
    t.context.activities[2].save(),
    t.context.activities[1].save(),
    t.context.activities[0].save()
  ])
  // activity with matching name, but not tags
  const activity = new Activity({
    name: 'The first 400 java robots',
    subtitle: 'Launching java robots into space step 3',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 400m',
    duration: '4 hours',
    tags: []
  })
  await activity.save()

  const res = await request(server)
    .get('/api/activities?search=java robots')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body

  // should return the 3 with assigned tags, and the one with matching name
  t.is(4, got.length)
})

// populate
test.serial('will populate out the org id with name and img', async t => {
  const act = t.context.activities[0]
  const res = await request(server)
    .get(`/api/activities/${act._id}`)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.name, act.name)
  t.is(got.offerOrg.name, t.context.orgs[0].name)
  t.is(got.owner.name, t.context.people[0].name)
})

// Test Equipment list
test.serial('Should correctly add and retrieve an activity with some equipment', async t => {
  const res = await request(server)
    .post('/api/activities')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({
      name: 'We need three things',
      subtitle: 'to succeed in life',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours',
      equipment: ['wishbone', 'backbone', 'funnybone']
    })
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const savedActivity = await Activity.findOne({ name: 'We need three things' }).exec()
  t.is(savedActivity.subtitle, 'to succeed in life')
  t.truthy(savedActivity.equipment.includes('backbone'))
})

test.serial('Create and retrieve an activity with documents', async t => {
  const docA = {
    filename: 'a.pdf',
    location: `https://amazonaws.com/${getBucketName()}/a.pdf`
  }
  const docB = {
    filename: 'b.pdf',
    location: `https://amazonaws.com/${getBucketName()}/b.pdf`
  }

  const res = await request(server)
    .post('/api/activities')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({
      name: 'We need three things',
      subtitle: 'to succeed in life',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours',
      documents: [docA, docB]
    })
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const act = await Activity.findOne({ _id: res.body._id })

  const resDocA = act.documents.find(d => d.filename === 'a.pdf')
  t.truthy(resDocA)
  t.is(resDocA.location, docA.location)

  const resDocB = act.documents.find(d => d.filename === 'b.pdf')
  t.truthy(resDocB)
  t.is(resDocB.location, docB.location)
})

test.serial('Create activity with document location of an incorrect s3 URL results in bad request', async t => {
  const docA = {
    filename: 'a.pdf',
    location: 'https://amazonaws.com/invalid-bucket-name/a.pdf'
  }

  const name = `${uuid.v1()}`

  const res = await request(server)
    .post('/api/activities')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({
      name,
      subtitle: 'to succeed in life',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours',
      documents: [docA]
    })
    .set('Accept', 'application/json')

  t.is(res.status, 400)
  t.falsy(await Activity.findOne({ name }))
})

test.serial('should permit activity titles with special characters', async t => {
  const res = await request(server)
    .post('/api/activities/')
    .send({
      // Testing some special chars. Stray < and > always get encoded to &lt; and &gt; by sanitizeHtml().
      name: 'Travel to the moon " / % ^ ( ) * @ # &',
      subtitle: 'Have you been to the moon?',
      description: 'On March 11, everyone is travelling to the moon.',
      location: 'Moon',
      owner: t.context.people[0]._id,
      tags: ['moon']
    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)

  t.is(res.status, 200)
  const queriedAct = await Activity.findOne({ subtitle: 'Have you been to the moon?' }).exec()
  t.is(queriedAct.name, 'Travel to the moon " / % ^ ( ) * @ # &')
})
