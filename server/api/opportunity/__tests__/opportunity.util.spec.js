import test from 'ava'
import { getLocationRecommendations } from '../opportunity.util'
import mongoose from 'mongoose'
import MemoryMongo from '../../../util/test-memory-mongo'
import Opportunity from '../opportunity'
import fixtures from './opportunity.util.fixture'
import Person from '../../person/person'
import Organisation from '../../organisation/organisation'
import { OpportunityStatus } from '../opportunity.constants'

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
    locations: ['Mars']
  })

  t.deepEqual(recommendedLocations, [])
})

test.serial('getLocationRecommendations > no opportunities', async (t) => {
  await Opportunity.deleteMany()

  const recommendedLocations = await getLocationRecommendations({
    _id: mongoose.Types.ObjectId(),
    locations: ['Westland']
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
    locations: ['Canterbury']
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
      locations: ['Akaroa, Canterbury'],
      expectedSortedNames: [
        'Test 2',
        'Test 3',
        'Test 1',
        'Test 4'
      ]
    },
    {
      locations: ['Allenton, Canterbury'],
      expectedSortedNames: [
        'Test 4',
        'Test 1',
        'Test 2',
        'Test 3'
      ]
    },
    {
      locations: ['Hawke\'s Bay'],
      expectedSortedNames: [
        'Test 5'
      ]
    }
  ]

  for (const data of testData) {
    const recommendedLocations = await getLocationRecommendations({
      _id: mongoose.Types.ObjectId(),
      locations: data.locations
    })
    const expectedResultsCount = data.expectedSortedNames.length

    t.is(recommendedLocations.length, expectedResultsCount)

    for (let i = 0; i < expectedResultsCount; i += 1) {
      t.is(recommendedLocations[i].name, data.expectedSortedNames[i])
    }
  }
})

test.serial('getLocationRecommendations - multiple person locations should match all ops with those locations', async (t) => {
  await Opportunity.deleteMany()

  const john = await Person.create({
    name: 'John',
    email: 'john@mail.com'
  })

  // Auckland opportunity
  await Opportunity.create({
    name: 'Auckland op',
    locations: ['South Auckland'],
    status: OpportunityStatus.ACTIVE,
    requestor: john._id
  })
  // Wellington opportunity
  await Opportunity.create({
    name: 'Wellington op',
    locations: ['Wellington'],
    status: OpportunityStatus.ACTIVE,
    requestor: john._id
  })
  // Christchurch opportunity
  await Opportunity.create({
    name: 'Christchurch op',
    locations: ['Christchurch'],
    status: OpportunityStatus.ACTIVE,
    requestor: john._id
  })

  const me = {
    _id: mongoose.Types.ObjectId(),
    locations: ['South Auckland', 'Wellington']
  }

  const recommendedOps = await getLocationRecommendations(me)
  // 'me' is interested in opportunities in both Auckland and Wellington, and two opportunities match this
  t.is(recommendedOps.length, 2)
  t.truthy(recommendedOps.find(op => op.name === 'Auckland op'))
  t.truthy(recommendedOps.find(op => op.name === 'Wellington op'))
})

/**
 * If a person has specified their location as a territory (i.e. Mount Victoria, Wellington), we should still return
 * opportunities for the parent region (i.e. Wellington)
 */
test.serial('getLocationRecommendations - return opportunity of parent region of "my" territory', async (t) => {
  await Opportunity.deleteMany()

  const john = await Person.create({
    name: 'John',
    email: 'john@mail.com'
  })

  // Mount Victoria, Wellington opportunity
  // (Mount Victoria, Wellington being a territory/child of Wellington)
  await Opportunity.create({
    name: 'Mount Victoria, Wellington op',
    locations: ['Mount Victoria, Wellington'],
    status: OpportunityStatus.ACTIVE,
    requestor: john._id
  })

  const me = {
    _id: mongoose.Types.ObjectId(),
    locations: ['Wellington'] // Wellington is the parent region of our test opportunity
  }

  const recommendedOps = await getLocationRecommendations(me)

  t.is(recommendedOps.length, 1)
  t.truthy(recommendedOps[0].name === 'Mount Victoria, Wellington op')
})

/**
 * handle multiple locations for person and for ops
 */
test.serial('getLocationRecommendations - I can work in two places', async (t) => {
  await Opportunity.deleteMany()

  const john = await Person.create({
    name: 'John',
    email: 'john@mail.com'
  })

  // (Mount Victoria being a territory/child of Wellington and Blaketown in Westland)
  await Opportunity.create({
    name: 'Mount Victoria, Wellington op',
    locations: ['Mount Victoria, Wellington', 'Blaketown, Westland'],
    status: OpportunityStatus.ACTIVE,
    requestor: john._id
  })

  // (Blaketown being a territory/child of Westland and Abbotsford in Otago )
  await Opportunity.create({
    name: 'Abbotsford, Otago op',
    locations: ['Abbotsford, Otago', 'Mount Victoria, Wellington'],
    status: OpportunityStatus.ACTIVE,
    requestor: john._id
  })

  // (Blaketown being a territory/child of Westland and Abbotsford in Otago )
  await Opportunity.create({
    name: 'Blaketown, Westland op',
    locations: ['Blaketown, Westland', 'Abbotsford, Otago'],
    status: OpportunityStatus.ACTIVE,
    requestor: john._id
  })

  const p1 = {
    _id: mongoose.Types.ObjectId(),
    locations: ['Wellington', 'Westland']
  }

  let recommendedOps = await getLocationRecommendations(p1)
  t.is(recommendedOps.length, 3)
  t.is(recommendedOps[0].name, 'Abbotsford, Otago op') // closest match.

  const p2 = {
    _id: mongoose.Types.ObjectId(),
    locations: ['Otago', 'Wellington']
  }

  recommendedOps = await getLocationRecommendations(p2)
  t.is(recommendedOps.length, 3)
  t.is(recommendedOps[0].name, 'Abbotsford, Otago op') // closest match.

  const p3 = {
    _id: mongoose.Types.ObjectId(),
    locations: ['Auckland', 'Otago']
  }

  recommendedOps = await getLocationRecommendations(p3)
  t.is(recommendedOps.length, 2)
  t.is(recommendedOps[0].name, 'Abbotsford, Otago op') // closest match.
})
