import test from 'ava'
import { getLocationRecommendations } from '../opportunity.util'
import mongoose from 'mongoose'
import MemoryMongo from '../../../util/test-memory-mongo'
import Opportunity from '../opportunity'
import fixtures from './opportunity.util.fixture'
import Person from '../../person/person'
import Organisation from '../../organisation/organisation'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.beforeEach('Load fixtures', async (t) => {
  await Person.create(fixtures.people)
  await Organisation.create(fixtures.organisations)

  const person = await Person.findOne()
  await Opportunity.create(fixtures.opportunities.map((opportunity) => {
    opportunity.requestor = person
    return opportunity
  }))
})

test.afterEach.always('Clear fixtures', async (t) => {
  await Person.deleteMany()
  await Opportunity.deleteMany()
  await Organisation.deleteMany()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.serial('getLocationRecommendations > no region match for location', async (t) => {
  const recommendedLocations = await getLocationRecommendations({
    _id: mongoose.Types.ObjectId(),
    location: 'Mars'
  })

  t.deepEqual(recommendedLocations, [])
})

test.serial('getLocationRecommendations > no opportunities', async (t) => {
  await Opportunity.deleteMany()

  const recommendedLocations = await getLocationRecommendations({
    _id: mongoose.Types.ObjectId(),
    location: 'Wellington'
  })

  t.deepEqual(recommendedLocations, [])
})

test.serial('getLocationRecommendations > no opportunities for requestor', async (t) => {
  const person = await Person.findOne()

  const recommendedLocations = await getLocationRecommendations(person)

  t.deepEqual(recommendedLocations, [])
})

test.serial('getLocationRecommendations > opportunities', async (t) => {
  const recommendedLocations = await getLocationRecommendations({
    _id: mongoose.Types.ObjectId(),
    location: 'Northland'
  })

  t.is(recommendedLocations.length, 4)

  const expectedSortedNames = [
    'Test 1',
    'Test 2',
    'Test 3',
    'Test 4'
  ]

  for (let i = 0; i < 4; i += 1) {
    t.is(recommendedLocations[i].name, expectedSortedNames[i])
  }
})

test.serial('getLocationRecommendations > closest opportunities', async (t) => {
  const testData = [
    {
      location: 'Whangarei District',
      expectedSortedNames: [
        'Test 2',
        'Test 3',
        'Test 1',
        'Test 4'
      ]
    },
    {
      location: 'Kaipara District',
      expectedSortedNames: [
        'Test 4',
        'Test 1',
        'Test 2',
        'Test 3'
      ]
    },
    {
      location: 'Waikato',
      expectedSortedNames: [
        'Test 5'
      ]
    }
  ]

  for (const data of testData) {
    const recommendedLocations = await getLocationRecommendations({
      _id: mongoose.Types.ObjectId(),
      location: data.location
    })

    const expectedResultsCount = data.expectedSortedNames.length

    t.is(recommendedLocations.length, expectedResultsCount)

    for (let i = 0; i < expectedResultsCount; i += 1) {
      t.is(recommendedLocations[i].name, data.expectedSortedNames[i])
    }
  }
})
