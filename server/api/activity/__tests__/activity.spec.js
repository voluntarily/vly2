import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'
import Tag from '../../tag/tag'
import Activity from '../activity'
import Person from '../../person/person'
import Organisation from '../../organisation/organisation'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from '../../person/__tests__/person.fixture'
import orgs from '../../organisation/__tests__/organisation.fixture'
import tags from '../../tag/__tests__/tag.fixture'

import acts from './activity.fixture.js'

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add two activity entries', async (t) => {
  // connect each activity to an owner and org
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.orgs = await Organisation.create(orgs).catch((err) => `Unable to create organisations: ${err}`)
  t.context.tags = await Tag.create(tags).catch((err) => `Unable to create tags: ${err}`)
  acts.map((act, index) => {
    act.owner = t.context.people[index]._id
    act.offerOrg = t.context.orgs[index]._id
    // each act has two consecutive tags from the list
    act.tags = [t.context.tags[index]._id, t.context.tags[index + 1]._id]
  })

  t.context.activities = await Activity.create(acts).catch((err) => console.error('Unable to create activities', err))
})

test.afterEach.always(async () => {
  await Activity.deleteMany()
  await Person.deleteMany()
  await Tag.deleteMany()
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
})

test.serial('Should correctly give count of all acts sorted by name', async t => {
  const res = await request(server)
    .get('/api/activities')
    .set('Accept', 'application/json')
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
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 2)
})

test.serial('Should correctly select just the titles and ids', async t => {
  const res = await request(server)
    .get('/api/activities?p={"name": 1}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, t.context.activities.length)
  t.is(got[0].status, undefined)
  t.is(got[0].name, acts[0].name)
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

test.serial('Should correctly add an activity', async t => {
  t.plan(2)

  const res = await request(server)
    .post('/api/activities')
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
    .send({
      title: 'The first 400 metres',
      subtitle: 'Launching into space step 3',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours'
    })
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const savedActivity = await Activity.findOne({ title: 'The first 400 metres' }).exec()
  t.is(savedActivity.subtitle, 'Launching into space step 3')

  // activity has been given the default image
  t.is(savedActivity.imgUrl, '../../../static/img/activity/activity.png')
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

// Searching for something in the description (case insensitive)
test.serial('Should correctly give activity 2 when searching by "Algorithms"', async t => {
  const res = await request(server)
    .get('/api/activities?search=AlgorithMs')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(acts[1].description, got[0].description)
  t.is(1, got.length)
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
    .get(`/api/activities?search=${t.context.tags[2].tag}`)
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
  const tags = t.context.tags
  t.context.activities[2].tags = [tags[0]._id, tags[2]._id]
  t.context.activities[0].tags = [tags[0]._id]
  t.context.activities[1].tags = [tags[2]._id]

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

test.serial('Should correctly add an activity with tags all having id properties', async t => {
  t.plan(3)

  const tags = t.context.tags

  const res = await request(server)
    .post('/api/activities')
    .send({
      name: 'The first 400 metres',
      subtitle: 'Launching into space step 3',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours',
      resource: '5 rockets and 6 volunteers',
      tags: tags,
      owner: t.context.people[0]._id
    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)

  const savedAct = await Activity.findOne({ name: 'The first 400 metres' }).exec()
  t.is(savedAct.subtitle, 'Launching into space step 3')
  t.is(t.context.tags.length, savedAct.tags.length)
})

test.serial('Should not add an activity with invalid tag ids', async t => {
  await request(server)
    .post('/api/activities')
    .send({
      name: 'The first 400 metres',
      subtitle: 'Launching into space step 3',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours',
      tags: [{ _id: '123456781234567812345678', tag: 'test' }],
      requestor: t.context.people[0]._id
    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  const savedAct = await Activity.findOne({ name: 'The first 400 metres' }).exec()
  t.is(null, savedAct)
})

test.serial('Should create tags that dont have the _id property', async t => {
  const tagName = 'noid'
  const tags = [
    t.context.tags[0],
    {
      tag: tagName
    }
  ]

  const existingTag = await Tag.findOne({ tag: tagName })
  t.is(null, existingTag)

  await request(server)
    .post('/api/activities')
    .send({
      name: 'The first 400 metres',
      subtitle: 'Launching into space step 3',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours',
      tags: tags,
      requestor: t.context.people[0]._id

    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  const savedTag = await Tag.findOne({ tag: tagName })
  t.is(tagName, savedTag.tag)

  const savedAct = await Activity.findOne({ name: 'The first 400 metres' }).populate('tags').exec()
  // ensure the tag has an id
  t.truthy(savedAct.tags.find(t => t.tag === tagName)._id)
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
