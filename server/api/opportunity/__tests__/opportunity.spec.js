import test from 'ava'
import request from 'supertest'
import { server } from '../../../server'
import Opportunity from '../opportunity'
import { connectDB, dropDB } from '../../../util/test-helpers'

// Initial posts added into test db
const oppos = [
  new Opportunity({
    _id: '5cc8d60b8b16812b5b3920c2',
    title: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Newmarket, Auckland',
    status: 'draft'
  }),
  new Opportunity({
    _id: '5cc8d60b8b16812b5b3920c1',
    title: 'The first 100 metres',
    subtitle: 'Launching into space',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 100m',
    duration: '2 hours',
    location: 'Albany, Auckland',
    status: 'draft'
  })

]

test.before('connect to mockgoose', async () => {
  await connectDB()
})

test.beforeEach('connect and add two oppo entries', async () => {
  await Opportunity.create(oppos).catch(() => 'Unable to create opportunities')
})

test.afterEach.always(async () => {
  await dropDB()
})

test.serial('Should correctly give number of Opportunities', async t => {
  t.plan(2)

  const res = await request(server)
    .get('/api/opportunities')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    // .expect('Content-Length', '2')
    .expect(200)
  t.is(res.status, 200)
  t.deepEqual(oppos.length, res.body.length)
})

test.serial('Should send correct data when queried against a _id', async t => {
  t.plan(2)

  const oppo = new Opportunity(
    {
      _id: '5cc8d60b8b16812b5b3920c3',
      title: 'The first 200 metres',
      subtitle: 'Launching into space step 2',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 200m',
      duration: '2 hours',
      location: 'Albany, Auckland',
      status: 'draft'
    }
  )
  oppo.save()

  const res = await request(server)
    .get('/api/opportunities/5cc8d60b8b16812b5b3920c3')
    .set('Accept', 'application/json')
  t.is(res.status, 200)
  t.is(res.body.title, oppo.title)
})

test.serial('Should correctly add an opportunity', async t => {
  t.plan(2)

  const res = await request(server)
    .post('/api/opportunities')
    .send({
      title: 'The first 400 metres',
      subtitle: 'Launching into space step 3',
      imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
      description: 'Project to build a simple rocket that will reach 400m',
      duration: '4 hours',
      location: 'Albany, Auckland',
      status: 'draft'
    })
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const savedOpportunity = await Opportunity.findOne({ title: 'The first 400 metres' }).exec()
  t.is(savedOpportunity.subtitle, 'Launching into space step 3')
})

test.serial('Should correctly delete an opportunity', async t => {
  t.plan(2)

  const opp = new Opportunity({
    _id: '5cc8d60b8b16812b5b3920c3',
    title: 'The first 1000 metres',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: 'draft'
  })
  opp.save()

  const res = await request(server)
    .delete(`/api/opportunities/${opp._id}`)
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const queriedOpportunity = await Opportunity.findOne({ _id: opp._id }).exec()
  t.is(queriedOpportunity, null)
})
