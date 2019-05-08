import test from 'ava'
import request from 'supertest'
import { server } from '../../../server'
import Interest from '../interest'
import { connectDB, dropDB } from '../../../util/test-helpers'

// Initial interests added into test db
const interests = [
    new Interest({
        _id: '5cc8d60b8b16812b5b3920c4',
        personId: 'acbdef12345',
        opportunityId: 'abcdef12345',
        comment: 'This is a test',
    }),
    new Interest({
        _id: '5cc8d60b8b16812b5b3920c5',
        personId: '54321fdcba',
        opportunityId: 'abcdef12345',
        comment: 'This is another test',
    }),
]

test.before('connect to mockgoose', async () => {
  await connectDB()
})

test.beforeEach('connect and add two interest entries', async () => {
  await Interest.create(interests).catch(() => 'Unable to create interests')
})

test.afterEach.always(async () => {
  await dropDB()
})

test.serial('Should correctly give number of Interests', async t => {
  t.plan(2)

  const res = await request(server)
    .get('/api/interests')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    // .expect('Content-Length', '2')
    .expect(200)
  t.is(res.status, 200)
  t.deepEqual(interests.length, res.body.length)
})

test.serial('Should send correct data when queried against a _id', async t => {

  const interest = new Interest(
    {
      _id: '5cc8d60b8b16812b5b3920c3',
      personId: 'shbjhb234',
      opportunityId: '1239u9u4b9u'
    }
  )
  interest.save()

  const res = await request(server)
    .get('/api/interests/5cc8d60b8b16812b5b3920c3')
    .set('Accept', 'application/json')
  t.is(res.status, 200)
  t.is(res.body.personId, interest.personId)
  t.is(res.body.opportunityId, interest.opportunityId)
})

test.serial('Should correctly add an interest', async t => {

  const res = await request(server)
    .post('/api/interests')
    .send({
        personId: 'shbjhb234',
        opportunityId: '1239u9u4b9u'
    })
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const savedInterest = await Interest.findOne({ 
      personId: 'shbjhb234',
      opportunityId: '1239u9u4b9u'
    }).exec()
  t.is(savedInterest.personId, 'shbjhb234')
  t.is(savedInterest.opportunityId, '1239u9u4b9u')
})

test.serial('Should correctly delete an interest', async t => {
  t.plan(2)

  const interest = new Interest({
      _id: '5cc8d60b8b16812b5b3920c9',
      personId: 'shbjhb234',
      opportunityId: '1239u9u4b9u',
      comment: 'hello there'
  })

  interest.save()

  const res = await request(server)
    .delete('/api/interests/5cc8d60b8b16812b5b3920c9')
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const queriedInterest = await Interest.findOne({ _id: interest._id }).exec()
  t.is(queriedInterest, null)
})
