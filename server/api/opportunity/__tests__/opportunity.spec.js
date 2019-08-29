import test from 'ava'
import request from 'supertest'
import MemoryMongo from '../../../util/test-memory-mongo'
import { server, appReady } from '../../../server'
import Opportunity from '../opportunity'
import Tag from '../../tag/tag'
import Person from '../../person/person'
import Organisation from '../../organisation/organisation'
import people from '../../person/__tests__/person.fixture'
import ops from './opportunity.fixture.js'
import orgs from '../../organisation/__tests__/organisation.fixture.js'
import tags from '../../tag/__tests__/tag.fixture'
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'
import archivedOpportunity from './../../archivedOpportunity/archivedOpportunity'
import { OpportunityStatus } from '../opportunity.constants'
import Interest from '../../interest/interest'
import InterestArchive from '../../interest-archive/interestArchive'

const { regions } = require('../../location/locationData')

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add two oppo entries', async (t) => {
  // connect each oppo to a requestor.
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.orgs = await Organisation.create(orgs).catch((err) => `Unable to create orgs: ${err}`)
  t.context.tags = await Tag.create(tags).catch((err) => `Unable to create tags: ${err}`)
  ops.map((op, index) => {
    op.requestor = t.context.people[index]._id
    op.offerOrg = t.context.orgs[1]._id
  })
  t.context.opportunities = await Opportunity.create(ops).catch((err) => console.log('Unable to create opportunities', err))
})

test.afterEach.always(async () => {
  await Opportunity.deleteMany()
  await Person.deleteMany()
  await Tag.deleteMany()
})

test.serial('verify fixture database has ops', async t => {
  const count = await Opportunity.countDocuments()
  t.is(count, t.context.opportunities.length)
  // can find all
  const p = await Opportunity.find()
  t.is(t.context.opportunities.length, p.length)

  // can find by things
  const q = await Opportunity.findOne({ name: '4 The first 100 metres' })
  t.is(q && q.duration, '2 hours')
})

test.serial('Should correctly give count of all active Ops sorted by name', async t => {
  const res = await request(server)
    .get('/api/opportunities')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  // console.log(got)
  t.is(2, got.length)

  t.is(got[0].name, '1 Mentor a year 12 business Impact Project')
})

test.serial('Should correctly give subset of ops matching status', async t => {
  const res = await request(server)
    .get('/api/opportunities?q={"status":"draft"}')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  // console.log('got', got)
  t.is(got.length, 3)
  // check requestor has been populated
  t.is(got[0].requestor.nickname, t.context.people[2].nickname)
  t.is(got[1].offerOrg.name, t.context.orgs[1].name)
})

test.serial('Should correctly select just the names and ids', async t => {
  const res = await request(server)
    .get('/api/opportunities?p={"name": 1}')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  // console.log('got', got)
  t.is(got[0].status, undefined)
  t.is(got[0].name, '1 Mentor a year 12 business Impact Project')
})

test.serial('Should correctly give number of active Opportunities', async t => {
  const res = await request(server)
    .get('/api/opportunities?q={"status": "active"}')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
    // .expect('Content-Length', '2')
  const got = res.body

  t.is(2, got.length)
})

test.serial('Should send correct data when queried against an _id', async t => {
  t.plan(4)

  const opp = new Opportunity({
    name: 'The first 1000 metres',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: OpportunityStatus.DRAFT,
    tags: [t.context.tags[0]._id],
    requestor: t.context.people[1]._id
  })
  await opp.save()

  const person1 = t.context.people[1]
  const res = await request(server)
    .get(`/api/opportunities/${opp._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 200)
  t.is(res.body.name, opp.name)

  // verify requestor was populated out
  t.is(res.body.requestor.name, person1.name)

  // verify tag was populated out
  t.is(res.body.tags[0].tag, t.context.tags[0].tag)
})

test.serial('Should not find invalid _id', async t => {
  const res = await request(server)
    .get(`/api/opportunities/5ce8acae1fbf56001027b254`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 404)
})

test.serial('Should correctly add an opportunity with tags all having id properties', async t => {
  t.plan(3)

  const tags = t.context.tags

  const res = await request(server)
    .post('/api/opportunities')
    .send({
      name: 'The first 400 metres',
      subtitle: 'Launching into space step 3',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours',
      location: 'Albany, Auckland',
      status: OpportunityStatus.DRAFT,
      tags: tags,
      requestor: t.context.people[0]._id
    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)

  const savedOpportunity = await Opportunity.findOne({ name: 'The first 400 metres' }).exec()
  t.is(savedOpportunity.subtitle, 'Launching into space step 3')
  t.is(t.context.tags.length, savedOpportunity.tags.length)
})

test.serial('Should not add an opportunity with invalid tag ids', async t => {
  await request(server)
    .post('/api/opportunities')
    .send({
      name: 'The first 400 metres',
      subtitle: 'Launching into space step 3',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours',
      location: 'Albany, Auckland',
      status: OpportunityStatus.DRAFT,
      tags: [{ _id: '123456781234567812345678', tag: 'test' }],
      requestor: t.context.people[0]._id

    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  const savedOpportunity = await Opportunity.findOne({ name: 'The first 400 metres' }).exec()
  t.is(null, savedOpportunity)
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
    .post('/api/opportunities')
    .send({
      name: 'The first 400 metres',
      subtitle: 'Launching into space step 3',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours',
      location: 'Albany, Auckland',
      status: OpportunityStatus.DRAFT,
      tags: tags,
      requestor: t.context.people[0]._id

    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  const savedTag = await Tag.findOne({ tag: tagName })
  t.is(tagName, savedTag.tag)

  const savedOpportunity = await Opportunity.findOne({ name: 'The first 400 metres' }).populate('tags').exec()
  // ensure the tag has an id
  t.truthy(savedOpportunity.tags.find(t => t.tag === tagName)._id)
})

test.serial('Should correctly delete an opportunity', async t => {
  t.plan(2)

  const opp = new Opportunity({
    name: 'The first 1000 metres',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: OpportunityStatus.DRAFT,
    requestor: t.context.people[0]._id
  })
  await opp.save()

  const res = await request(server)
    .delete(`/api/opportunities/${opp._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)

  const queriedOpportunity = await Opportunity.findOne({ _id: opp._id }).exec()
  t.is(queriedOpportunity, null)
})

// Searching by something in the name (case insensitive)
test.serial('Should correctly give opportunity 1 when searching by "Mentor"', async t => {
  const res = await request(server)
    .get('/api/opportunities?search=MeNTor')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(ops[0].name, got[0].name)
  t.is(1, got.length)
})

test.serial('Should find no matches', async t => {
  const res = await request(server)
    .get('/api/opportunities?q={"name":"nomatches"}')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  // console.log('got', got)
  t.is(got.length, 0)
})

test.serial('Should fail to find - invalid query', async t => {
  const res = await request(server)
    .get('/api/opportunities?s={"invalid":"nomatches"}')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(404)
  t.is(res.status, 404)
})

// Searching for something in the subtitle (case insensitive)
test.serial('Should correctly give opportunity 2 when searching by "Algorithms"', async t => {
  const res = await request(server)
    .get('/api/opportunities?search=AlgorithMs')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(ops[1].subtitle, got[0].subtitle)
  t.is(1, got.length)
})

test.serial('Should include description in search', async t => {
  const res = await request(server)
    .get('/api/opportunities?search=innovation')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(ops[1].description, got[0].description)
  t.is(1, got.length)
})

test.serial('Should return any opportunities with matching tags or name/desc/subtitle', async t => {
  // assign tags to opportunities
  const tags = t.context.tags
  t.context.opportunities[2].tags = [tags[0]._id, tags[2]._id]
  t.context.opportunities[0].tags = [tags[0]._id]
  t.context.opportunities[1].tags = [tags[2]._id]

  await Promise.all([
    t.context.opportunities[2].save(),
    t.context.opportunities[1].save(),
    t.context.opportunities[0].save()
  ])

  // opportunity with matching name, but not tags
  const opp = new Opportunity({
    name: 'Java Robots in the house',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: OpportunityStatus.DRAFT,
    requestor: t.context.people[0]._id,
    tags: []
  })
  await opp.save()

  const res = await request(server)
    .get(`/api/opportunities?search=java robots`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body

  // should return the 3 with assigned tags, and the one with matching name
  t.is(2, got.length)
})

test.serial('Should update from draft to active', async t => {
  t.plan(2)

  const opp = new Opportunity({
    name: 'Java Robots in the house',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: OpportunityStatus.DRAFT,
    requestor: t.context.people[0]._id
  })

  await opp.save()
  const res = await request(server)
    .put(`/api/opportunities/${opp._id}`)
    .send({ status: OpportunityStatus.ACTIVE })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)

  t.is(res.status, 200)
  const queriedOpportunity = await Opportunity.findOne({ name: 'Java Robots in the house' }).exec()
  t.is(queriedOpportunity.status, OpportunityStatus.ACTIVE)
})

test.serial('Should archive Opportunity when a completed update is sent', async t => {
  t.plan(2)

  const opp = new Opportunity({
    name: 'Java Robots in the house',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: OpportunityStatus.ACTIVE,
    requestor: t.context.people[0]._id
  })

  await opp.save()
  const res = await request(server)
    .put(`/api/opportunities/${opp._id}`)
    .send({ status: OpportunityStatus.COMPLETED })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)

  t.is(res.status, 200)
  const queriedOpportunity = await archivedOpportunity.findOne({ name: 'Java Robots in the house' }).exec()
  t.is(queriedOpportunity.status, OpportunityStatus.COMPLETED)
})

test.serial('should archive interests associated with opportunity', async t => {
  t.plan(3)

  const opp = new Opportunity({
    name: 'Java Robots in the house',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: OpportunityStatus.DRAFT,
    requestor: t.context.people[0]._id
  })

  await opp.save()

  const interest = new Interest({
    opportunity: opp._id,
    status: 'interested',
    person: t.context.people[1]._id
  })

  await interest.save()

  const res = await request(server)
    .put(`/api/opportunities/${opp._id}`)
    .send({ status: OpportunityStatus.COMPLETED })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)

  t.is(res.status, 200)
  const archivedInterest = await InterestArchive.findOne({ _id: interest._id }).exec()
  t.is(archivedInterest.status, 'interested')
  const oldInterest = await Interest.findOne({ _id: interest._id }).exec()
  t.is(oldInterest, null)
})

test.serial('should return 400 for a bad request', async t => {
  t.plan(1)

  const opp = new Opportunity({
    name: 'Java Robots in the house',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: OpportunityStatus.DRAFT,
    requestor: t.context.people[0]._id
  })

  await opp.save()

  const res = await request(server)
    .put(`/api/opportunities/${opp._id}`)
    .send({ status: { invalidObject: '' } })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(400)

  t.is(res.status, 400)
})

test.serial('should return all matching opps within the specified region', async t => {
  const res = await request(server)
    .get(`/api/opportunities?q={}&location=${regions[0].name}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)

  const got = res.body

  // 1 match for the region, 2 for territories WITHIN the region
  t.is(got.length, 4)

  const validLocs = [
    regions[0].name,
    ...regions[0].containedTerritories
  ]

  // ensure nothing was retrieved that shouldn't have been
  t.falsy(got.find(op => !validLocs.includes(op.location)))
})

test.serial('should return opps at the specified territory', async t => {
  const res = await request(server)
    .get(`/api/opportunities?location=${regions[0].containedTerritories[1]}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)

  const got = res.body

  t.is(got.length, 1)

  // ensure nothing was retrieved that shouldn't have been
  t.falsy(
    got.find(
      op => op.location !== regions[0].containedTerritories[1]
    ))
})

test.serial('should return opps within the specified region that also match the search term', async t => {
  const res = await request(server)
    .get(`/api/opportunities?search=mentor&location=${regions[0].name}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)

  const got = res.body

  t.is(got.length, 1)

  const validLocs = [
    regions[0].name,
    ...regions[0].containedTerritories
  ]

  // ensure nothing was retrieved that shouldn't have been
  t.falsy(
    got.find(
      op => op.name !== ops[0].name || !validLocs.includes(op.location)
    ))
})

test.serial('should permit titles with special characters', async t => {
  const res = await request(server)
    .post('/api/opportunities/')
    .send({
      // Testing some special chars. Stray < and > always get encoded to &lt; and &gt; by sanitizeHtml().
      name: 'Lego Robots " / % ^ ( ) * @ #',
      subtitle: 'Lego Mindstorms EV3',
      description: 'Building with Lego Mindstorms EV3.',
      location: 'Wellington City',
      status: OpportunityStatus.ACTIVE,
      requestor: t.context.people[0]._id
    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)

  t.is(res.status, 200)
  const queriedOpp = await Opportunity.findOne({ subtitle: 'Lego Mindstorms EV3' }).exec()
  //
  t.is(queriedOpp.name, 'Lego Robots " / % ^ ( ) * @ #')
})

test.serial('should permit descriptions with special characters', async t => {
  const res = await request(server)
    .post('/api/opportunities/')
    .send({
      name: 'Lego Robots',
      // Testing some special chars. Stray < and > always get encoded to &lt; and &gt; by sanitizeHtml().
      description: 'Build and program Lego robots. " / % ^ ( ) * @ #',
      location: 'Wellington City',
      status: OpportunityStatus.ACTIVE,
      requestor: t.context.people[0]._id
    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)

  t.is(res.status, 200)
  const queriedOpp = await Opportunity.findOne({ name: 'Lego Robots' })
  t.is(queriedOpp.description, 'Build and program Lego robots. " / % ^ ( ) * @ #')
})

test.serial('should strip script tags and contents from name', async t => {
  const res = await request(server)
    .post('/api/opportunities/')
    .send({
      name: 'Lego Robots<script>var xhr = new XMLHttpRequest();</script>',
      subtitle: 'Build and program Lego robots with Mindstorms EV3.',
      description: '-',
      location: 'Wellington City',
      status: OpportunityStatus.ACTIVE,
      requestor: t.context.people[0]._id
    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)

  t.is(res.status, 200)
  const queriedOpp = await Opportunity.findOne({ subtitle: 'Build and program Lego robots with Mindstorms EV3.' }).exec()
  t.is(queriedOpp.name, 'Lego Robots')
})

test.serial('should strip "color:blue" and "font-size:2em" from style attribute', async t => {
  const res = await request(server)
    .post('/api/opportunities')
    .send({
      name: 'Lego Robots',
      description: '<span style="color:blue; font-size:2em;">Build</span> and program <span style="color:rgb(250,0,0)">Lego</span> robots.',
      location: 'Wellington City',
      status: OpportunityStatus.ACTIVE,
      requestor: t.context.people[0]._id
    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)

  t.is(res.status, 200)
  const queriedOpp = await Opportunity.findOne({ name: 'Lego Robots' }).exec()
  t.is(queriedOpp.description, '<span>Build</span> and program <span style="color:rgb(250,0,0)">Lego</span> robots.')
})

test.serial('should allow iframes from youtube only, and allow height, src and width attributes', async t => {
  const res = await request(server)
    .post('/api/opportunities')
    .send({
      name: 'Lego Robots',
      description: '<p>Build and program Lego robots.</p>' +
        '<p><iframe width="560" height="315" src="https://www.youtube.com/embed/wLupj65qJHg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>' +
        '<p><iframe width="560" height="315" src="https://www.youtuberepeater.com/embed/wLupj65qJHg"></iframe></p>',
      location: 'Wellington City',
      status: OpportunityStatus.ACTIVE,
      requestor: t.context.people[0]._id
    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)

  t.is(res.status, 200)
  const queriedOpp = await Opportunity.findOne({ name: 'Lego Robots' }).exec()
  t.is(queriedOpp.description, '<p>Build and program Lego robots.</p>' +
    '<p><iframe width="560" height="315" src="https://www.youtube.com/embed/wLupj65qJHg"></iframe></p>' +
    '<p><iframe width="560" height="315"></iframe></p>')
})
