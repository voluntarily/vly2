import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Interest from '../interest'
import Opportunity from '../../opportunity/opportunity'
import Person from '../../person/person'
// import { connectDB, dropDB } from '../../../util/test-helpers'
import MemoryMongo from '../../../util/test-memory-mongo'
// import people from '../../person/__tests__/person.fixture'
// import ops from './opportunity.fixture.js'

const person = new Person({
  _id: '5cc8d60b8b16812b5b392123',
  name: 'Testy McTestface',
  nickname: 'Testy',
  about:
    '30+ years in software development, product management, systems design and team leadership across a range of industries including science, technology, engineering, health, automotive, transport, mobile phone, and travel. I have a strong balance of technical and management skills.\n\nI have run my own company and led a start-up mobile phone company software team through a high growth period. I have created and developed multiple agile cross functional teams, managed DevOps processes and modernised IT platforms including migration to cloud services.\n\nI have a track record as a forward-thinking, customer focussed, innovative solutions designer and product development manager taking ideas from conception through implementation and delivery and into operation through a full business-process-aligned life cycle, managing teams using agile methodologies, leading-edge tools and technologies. ',

  email: 'testy@voluntar.ly',
  phone: '027 444 5555',
  gender: 'rather not say',
  password: 'A43C1257802AF34895aDDDE',
  avatar:
    'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
  role: ['tester', 'volunteer'],
  status: 'active'
})

const opportunity = new Opportunity({
  _id: '5cc8d60b8b16812b5b392321',
  title: 'Self driving model cars ',
  subtitle: 'using algorithmns to follow lines and avoid obstacles',
  imgUrl:
    'http://www.plaz-tech.com/wp-content/plugins/wp-easycart-data/products/pics1/Arduino%20Car%202_8ab5dd38f1e3f6f05ad244f1e5e74529.jpg',
  description:
    '# NZTA Innovation Centre\n \n We have 6 model cars with sensors for vision, proximity etc, \n controlled by Arduinos teach them to solve \n 4 challenges - move, follow a line, avoid obstacles, \n get to a destination etc. \n \n ## We need:\n * Open space with room for the test tracks - e.g a school hall\n * teams of 5 students\n * on adult helper per team, should be able to follow instructions and understand a little C++\n \n ## Learning outcomes:\n * programming a remote device\n * simple coding\n * algorithmic thinking\n * problem solving.\n \n',
  duration: '4 hours',
  location: 'NZTA Innovation Centre, 5 Cook St Auckland',
  status: 'draft',
  requestor: person._id
})

// Initial interests added into test db
const interest = new Interest({
  _id: '5cc8d60b8b16812b5b3920c5',
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
  await Opportunity.create(opportunity).catch(
    () => 'Unable to create opportunity'
  )
  await Interest.create(interest).catch(() => 'Unable to create interests')
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
  t.deepEqual(1, res.body.length)
})

test.serial('Should send correct data when queried against a _id', async t => {
  const res = await request(server)
    .get(`/api/interests/${interest._id}`)
    .set('Accept', 'application/json')
  t.is(200, res.status)
  t.is(interest.person.toString(), res.body.person)
  t.is(interest.opportunity.toString(), res.body.opportunity)
})

test.skip(
  'Should not add an invalid interest where referenced person or opp is not in DB',
  async t => {
    const newInterest = new Interest({
      person: '5cc8d60b8b16812b5babcdef',
      opportunity: '5cc8d60b8b16812b5babcdef'
    })

    await request(server)
      .post('/api/interests')
      .send(newInterest)
      .set('Accept', 'application/json')

    const savedInterest = await Interest.findOne({
      person: newInterest.person,
      opportunity: newInterest.opportunity
    }).exec()

    t.is(null, savedInterest)
  }
)

test.serial('Should correctly add a valid interest', async t => {
  const newInterest = {
    person: person._id.toString(),
    opportunity: opportunity._id.toString()
  }

  const res = await request(server)
    .post('/api/interests')
    .send(newInterest)
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const savedInterest = await Interest.findOne({
    person: newInterest.person,
    opportunity: newInterest.opportunity
  }).exec()
  t.is(savedInterest.person._id.toString(), person._id.toString())
  t.is(savedInterest.opportunity._id.toString(), opportunity._id.toString())
})

test.serial('Should correctly delete an interest', async t => {
  t.plan(2)

  const newInterest = new Interest({
    _id: '5cc8d60b8b16812b5b3920c9',
    person: person._id,
    opportunity: opportunity._id,
    comment: 'hello there'
  })

  await newInterest.save()

  const res = await request(server)
    .delete(`/api/interests/${newInterest._id}`)
    .set('Accept', 'application/json')

  t.is(res.status, 200)

  const queriedInterest = await Interest.findOne({
    _id: newInterest._id
  }).exec()
  t.is(null, queriedInterest)
})
