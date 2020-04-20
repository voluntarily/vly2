import test from 'ava'
import request from 'supertest'
import MemoryMongo from '../../../util/test-memory-mongo'
import { server, appReady } from '../../../server'
import { regions } from '../../location/locationData'

// Schemas
import Opportunity from '../opportunity'
import { OpportunityStatus, OpportunityType } from '../opportunity.constants'
import Person from '../../person/person'
import Organisation from '../../organisation/organisation'
import archivedOpportunity from './../../archivedOpportunity/archivedOpportunity'
import { Interest, InterestArchive } from '../../interest/interest'

// Fixtures
import people from '../../person/__tests__/person.fixture'
import ops from './opportunity.fixture.js'
import orgs from '../../organisation/__tests__/organisation.fixture.js'
import tags from '../../tag/__tests__/tag.fixture'
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.orgs = await Organisation.create(orgs).catch((err) => `Unable to create orgs: ${err}`)
  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add two oppo entries', async (t) => {
  // connect each oppo to a requestor.
  ops.map((op, index) => {
    op.requestor = t.context.people[index]._id
    op.offerOrg = t.context.orgs[1]._id
    op.tags = [tags[index]]
  })
  t.context.opportunities = await Opportunity.create(ops).catch((err) => console.error('Unable to create opportunities', err))
})

test.afterEach.always(async () => {
  await Opportunity.deleteMany()
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
  t.is(3, got.length)

  t.is(got[0].name, '1 Mentor a year 12 business Impact Project')
  t.is(got[0].type, OpportunityType.ASK)
})

test.serial('Should correctly give subset of ops matching status', async t => {
  const res = await request(server)
    .get('/api/opportunities?q={"status":"draft"}')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 3)
  // check requestor has been populated
  t.is(got[0].requestor.nickname, t.context.people[2].nickname)
  t.is(got[1].offerOrg.name, t.context.orgs[1].name)
})

test.serial('Should correctly select just the names and ids', async t => {
  const res = await request(server)
    .get('/api/opportunities?p="name type"')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got[0].status, undefined)
  t.is(got[0].name, '1 Mentor a year 12 business Impact Project')
  t.is(got[0].type, OpportunityType.ASK)
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

  t.is(3, got.length)
})

test.serial('Should correctly give number of active offers ', async t => {
  const res = await request(server)
    .get('/api/opportunities?q={"status": "active", "type": "offer"}')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body

  t.is(1, got.length)
  t.is(got[0].type, OpportunityType.OFFER)
})

test.serial('Should send correct data when queried against an _id', async t => {
  const opp = new Opportunity({
    name: 'The first 1000 metres',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: OpportunityStatus.DRAFT,
    tags: [tags[0]],
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
  t.is(res.body.type, OpportunityType.ASK) // should be defaulted

  // verify requestor was populated out
  t.is(res.body.requestor.name, person1.name)
})

test.serial('Should not find invalid _id', async t => {
  const res = await request(server)
    .get('/api/opportunities/5ce8acae1fbf56001027b254')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 404)
})

test.serial('Should correctly add an opportunity with default image', async t => {
  t.plan(3)
  const op = {
    name: 'The last 2000 metres',
    subtitle: 'Launching into space step 50',
    description: 'Project to build a simple rocket that will reach 400m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: OpportunityStatus.DRAFT,
    tags: tags,
    requestor: t.context.people[0]._id
  }

  const res = await request(server)
    .post('/api/opportunities')
    .send(op)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)

  const savedOpportunity = await Opportunity.findOne({ name: op.name }).exec()
  t.is(savedOpportunity.subtitle, 'Launching into space step 50')
  t.is(savedOpportunity.imgUrl, '/static/img/opportunity/opportunity.png')
})

test.serial('Should correctly add an offer opportunity', async t => {
  const op = {
    type: OpportunityType.OFFER,
    name: 'I have spare laptops',
    subtitle: 'I can lend out some old working pcs',
    description: 'They work and have windows 10 installed.',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: OpportunityStatus.DRAFT,
    tags: tags,
    requestor: t.context.people[0]._id
  }

  const res = await request(server)
    .post('/api/opportunities')
    .send(op)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)

  const savedOpportunity = await Opportunity.findOne({ name: op.name }).exec()
  t.is(savedOpportunity.subtitle, 'I can lend out some old working pcs')
  t.is(savedOpportunity.type, OpportunityType.OFFER)
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
    requestor: t.context.people[0]._id,
    tags: tags
  })
  await opp.save()

  const res = await request(server)
    .delete(`/api/opportunities/${opp._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 204)

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

test.serial('Should not include description in search', async t => {
  const res = await request(server)
    .get('/api/opportunities?search=innovation')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 1)
  t.is(got.description, undefined)
})

test.serial('Should return any opportunities with matching tags or name/desc/subtitle', async t => {
  // assign tags to opportunities
  t.context.opportunities[2].tags = ['java', 'robots']
  t.context.opportunities[0].tags = ['java']
  t.context.opportunities[1].tags = ['robots']

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
    .get('/api/opportunities?search=java robots')
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
    requestor: t.context.people[0]._id,
    tags: []
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
    requestor: t.context.people[0]._id,
    tags
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
    requestor: t.context.people[0]._id,
    tags
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
    requestor: t.context.people[0]._id,
    tags
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

const arrayIntersects = (arrA, arrB) => arrA.filter(x => arrB.includes(x)).length

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
})

test.serial('should permit titles with special characters', async t => {
  const res = await request(server)
    .post('/api/opportunities/')
    .send({
      // Testing some special chars. Stray < and > always get encoded to &lt; and &gt; by sanitizeHtml().
      name: 'Lego Robots " / % ^ ( ) * @ # &',
      subtitle: 'Lego Mindstorms EV3',
      description: 'Building with Lego Mindstorms EV3.',
      location: 'Wellington City',
      status: OpportunityStatus.ACTIVE,
      requestor: t.context.people[0]._id,
      tags: ['lego']
    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)

  t.is(res.status, 200)
  const queriedOpp = await Opportunity.findOne({ subtitle: 'Lego Mindstorms EV3' }).exec()
  //
  t.is(queriedOpp.name, 'Lego Robots " / % ^ ( ) * @ # &')
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
      requestor: t.context.people[0]._id,
      tags: ['robot']

    })
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .expect(200)

  t.is(res.status, 200)
  const queriedOpp = await Opportunity.findOne({ name: 'Lego Robots' })
  t.is(queriedOpp.description, 'Build and program Lego robots. " / % ^ ( ) * @ #')
})

test.serial('should strip "color:blue" and "font-size:2em" from style attribute', async t => {
  const res = await request(server)
    .post('/api/opportunities')
    .send({
      name: 'Lego Robots',
      description: '<span style="color:blue; font-size:2em;">Build</span> and program <span style="color:rgb(250,0,0)">Lego</span> robots.',
      location: 'Wellington City',
      status: OpportunityStatus.ACTIVE,
      requestor: t.context.people[0]._id,
      tags: ['blue']

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
      requestor: t.context.people[0]._id,
      tags: ['iframe']
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
