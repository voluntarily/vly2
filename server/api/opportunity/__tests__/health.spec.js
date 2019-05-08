import test from 'ava'
import request from 'supertest'
import { server } from '../../../server'
import { connectDB, dropDB } from '../../../util/test-mongo'
import Opportunity from '../opportunity'


test.before('connect to mongo', async () => {
  await connectDB()
})

test.beforeEach('connect and add two oppo entries', async () => {
  // await Opportunity.create(oppos).catch(() => 'Unable to create opportunities')
})

test.afterEach('remove all oppo entries', async () => {
  // await Opportunity.remove().catch(() => 'Unable to remove opportunities')
})

test.after.always('clean up', async () => {
  console.log('after')
  await Opportunity.remove().catch(() => 'Unable to remove opportunities')
  await dropDB()
})

test.serial('verify fixture database has ops', async t => {
  const count = await Opportunity.countDocuments()
  t.is(count, 2)

  // can find by email with then
  await Opportunity.findOne({ title: 'Growing in the garden' }).then((op) => {
    t.is(op.subtitle, 'Growing digitally in the garden')
  })

  await Opportunity.find().then((p) => {
    t.is(oppos.length, p.length)
  })
})

test.only('Should correctly give number of Opportunities', async t => {
  // t.plan(2)

  const count = await Opportunity.countDocuments()
  t.is(count, 2)

  // can find by email with then
  await Opportunity.findOne({ title: 'Growing in the garden' }).then((op) => {
    t.is(op.subtitle, 'Growing digitally in the garden')
  })

  const res = await request(server)
    .get('/api/opportunities')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    // .expect('Content-Length', '2')

  t.deepEqual(oppos.length, res.body.length)
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
