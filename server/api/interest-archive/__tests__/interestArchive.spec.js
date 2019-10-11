import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import InterestArchive from '../interestArchive'
// import Opportunity from '../../opportunity/opportunity'
import ArchivedOpportunity from '../../archivedOpportunity/archivedOpportunity'
import Person from '../../person/person'
import MemoryMongo from '../../../util/test-memory-mongo'

const person = new Person({
  _id: '5cc8d60b8b16812b5b392123',
  name: 'Testy McTestface',
  nickname: 'Testy',
  about:
    '30+ years in software development, product management, systems design and team leadership across a range of industries',
  email: 'testy@voluntar.ly',
  phone: '027 444 5555',
  gender: 'rather not say',
  password: 'A43C1257802AF34895aDDDE',
  imgUrl:
    'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
  role: ['tester', 'volunteer'],
  status: 'active'
})

const opportunity = new ArchivedOpportunity({
  _id: '5cc8d60b8b16812b5b392321',
  date: [
    '2019-08-19T04:44:26+0000'
  ],
  name: 'Self driving model cars ',
  subtitle: 'using algorithmns to follow lines and avoid obstacles',
  imgUrl:
    'http://www.plaz-tech.com/wp-content/plugins/wp-easycart-data/products/pics1/Arduino%20Car%202_8ab5dd38f1e3f6f05ad244f1e5e74529.jpg',
  description:
    '# NZTA Innovation Centre\n \n We have 6 model cars with sensors for vision, proximity etc, \n controlled by Arduinos teach them to solve \n 4 challenges - move, follow a line, avoid obstacles, \n get to a destination etc. \n \n ## We need:\n * Open space with room for the test tracks - e.g a school hall\n * teams of 5 students\n * on adult helper per team, should be able to follow instructions and understand a little C++\n \n ## Learning outcomes:\n * programming a remote device\n * simple coding\n * algorithmic thinking\n * problem solving.\n \n',
  duration: '4 hours',
  location: 'NZTA Innovation Centre, 5 Cook St Auckland',
  status: 'active',
  requestor: person._id
})

// Initial interests added into test db
const interest = new InterestArchive({
  _id: '5cc8d60b8b16812b5b3920c5',
  status: 'invited',
  person: person._id,
  opportunity: opportunity._id,
  comment: 'This is another test'
})

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and set up test fixture', async () => {
  await Person.create(person).catch(() => 'Unables to create person')
  await ArchivedOpportunity.create(opportunity).catch(() => 'Unable to create archived opportunity')
  await InterestArchive.create(interest).catch(() => 'Unable to create archived interest')
})

test.serial('Should correctly give number of Interests Arhived', async t => {
  t.plan(2)
  const res = await request(server)
    .get('/api/interestsArchived')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
  console.log(res.body)
  t.is(res.status, 200)
  t.is(res.body.length, 1)
})

test.serial('Should send correct data when queried against a _id', async t => {
  const res = await request(server)
    .get(`/api/interestsArchived/${interest._id}`)
    .set('Accept', 'application/json')
  t.is(200, res.status)
  t.is(interest.person.toString(), res.body.person)
  t.is(interest.opportunity.toString(), res.body.opportunity)
})

test.serial('Should return 404 code when queried non existing interest', async t => {
  const res = await request(server)
    .get(`/api/interestsArchived/5cc8d60b8b16812b5b392123`)
  const expectedResponseStatus = 404
  t.is(res.status, expectedResponseStatus)
})

test.serial('Should update the interest state from interested to attended', async t => {
  const reqData = {
    status: 'attended',
    _id: interest._id,
    person: {
      nickname: person.nickname,
      _id: person._id
    },
    comment: 'lol',
    opportunity: opportunity._id,
    date: 'Sanitize it plz'
  }
  const res = await request(server)
    .put(`/api/interestsArchived/${interest._id}`)
    .send(reqData)
    .set('Accept', 'application/json')
  console.log(res.body)
  console.log(res.header)
  t.is(res.status, 200)
})

test.serial('Should correctly delete an interest', async t => {
  t.plan(2)
  const newInterestArchive = new InterestArchive({
    _id: '5cc8d60b8b16812b5b3920c9',
    person: person._id,
    opportunity: opportunity._id,
    comment: 'hello there'
  })
  await newInterestArchive.save()
  const res = await request(server)
    .delete(`/api/interestsArchived/${newInterestArchive._id}`)
    .set('Accept', 'application/json')
  t.is(res.status, 200)
  const queriedInterest = await InterestArchive.findOne({
    _id: newInterestArchive._id
  }).exec()
  t.is(null, queriedInterest)
})
