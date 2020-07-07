import test from 'ava'
import {
  getLocationRecommendations,
  getSkillsRecommendations
} from '../opportunity.util'
import mongoose from 'mongoose'
import MemoryMongo from '../../../util/test-memory-mongo'
import Opportunity from '../opportunity'
import fixtures from './opportunity.util.fixture'
import Person from '../../person/person'
import Organisation from '../../organisation/organisation'
import { OpportunityStatus, OpportunityType } from '../opportunity.constants'
import { Role } from '../../../services/authorize/role'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.beforeEach('Load fixtures', async (t) => {
  await Person.create(fixtures.people)
  await Organisation.create(fixtures.organisations)

  const person = await Person.findOne()
  await Opportunity.create(
    fixtures.opportunities.map((opportunity) => {
      opportunity.requestor = person
      return opportunity
    })
  )
})

test.afterEach.always('Clear fixtures', async (t) => {
  await Person.deleteMany()
  await Opportunity.deleteMany()
  await Organisation.deleteMany()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

/**
 *
 * Tests for recommendations based on location
 *
 **/
test.serial(
  'getLocationRecommendations > no region match for location',
  async (t) => {
    const recommendedLocations = await getLocationRecommendations({
      _id: mongoose.Types.ObjectId(),
      locations: ['Mars']
    })

    t.deepEqual(recommendedLocations, [])
  }
)

test.serial('getLocationRecommendations > no opportunities', async (t) => {
  await Opportunity.deleteMany()

  const recommendedLocations = await getLocationRecommendations({
    _id: mongoose.Types.ObjectId(),
    locations: ['Wellington']
  })

  t.deepEqual(recommendedLocations, [])
})

test.serial(
  'getLocationRecommendations > no opportunities for requestor',
  async (t) => {
    const person = await Person.findOne()

    const recommendedLocations = await getLocationRecommendations(person)

    t.deepEqual(recommendedLocations, [])
  }
)

test.serial('getLocationRecommendations > opportunities', async (t) => {
  const recommendedLocations = await getLocationRecommendations({
    _id: mongoose.Types.ObjectId(),
    locations: ['Northland']
  })

  t.is(recommendedLocations.length, 4)

  const expectedSortedNames = ['Test 1', 'Test 2', 'Test 3', 'Test 4']

  for (let i = 0; i < 4; i += 1) {
    t.is(recommendedLocations[i].name, expectedSortedNames[i])
  }
})

test.serial('getLocationRecommendations > closest opportunities', async (t) => {
  const testData = [
    {
      locations: ['Whangarei District'],
      expectedSortedNames: ['Test 2', 'Test 3', 'Test 1', 'Test 4']
    },
    {
      locations: ['Kaipara District'],
      expectedSortedNames: ['Test 4', 'Test 1', 'Test 2', 'Test 3']
    },
    {
      locations: ['Waikato'],
      expectedSortedNames: ['Test 5']
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

test.serial(
  'getLocationRecommendations - multiple person locations should match all ops with those locations',
  async (t) => {
    await Opportunity.deleteMany()

    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    // Auckland opportunity
    await Opportunity.create({
      name: 'Auckland op',
      locations: ['Auckland'],
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
      locations: ['Auckland', 'Wellington']
    }

    const recommendedOps = await getLocationRecommendations(me)
    // 'me' is interested in opportunities in both Auckland and Wellington, and two opportunities match this
    t.is(recommendedOps.length, 2)
    t.truthy(recommendedOps.find((op) => op.name === 'Auckland op'))
    t.truthy(recommendedOps.find((op) => op.name === 'Wellington op'))
  }
)

/**
 * If a person has specified their location as a territory (i.e. Lower Hutt City), we should still return
 * opportunities for the parent region (i.e. Wellington)
 */
test.serial(
  'getLocationRecommendations - return opportunity of parent region of "my" territory',
  async (t) => {
    await Opportunity.deleteMany()

    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    // Lower Hutt City opportunity
    // (Lower Hutt City being a territory/child of Wellington)
    await Opportunity.create({
      name: 'Lower Hutt City op',
      locations: ['Lower Hutt City'],
      status: OpportunityStatus.ACTIVE,
      requestor: john._id
    })

    const me = {
      _id: mongoose.Types.ObjectId(),
      locations: ['Wellington'] // Wellington is the parent region of our test opportunity
    }

    const recommendedOps = await getLocationRecommendations(me)

    t.is(recommendedOps.length, 1)
    t.truthy(recommendedOps[0].name === 'Lower Hutt City op')
  }
)

/**
 * handle multiple locations for person and for ops
 */
test.serial(
  'getLocationRecommendations - I can work in two places',
  async (t) => {
    await Opportunity.deleteMany()

    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    // Lower Hutt City opportunity
    // (Lower Hutt City being a territory/child of Wellington)
    await Opportunity.create({
      name: 'Lower Hutt City op',
      locations: ['Lower Hutt City', 'Kaipara District'],
      status: OpportunityStatus.ACTIVE,
      requestor: john._id
    })

    // (Kaipara being a territory/child of Northland and Hauraki in Waikato )
    await Opportunity.create({
      name: 'Hauraki District op',
      locations: ['Hauraki District', 'Lower Hutt City'],
      status: OpportunityStatus.ACTIVE,
      requestor: john._id
    })
    // (Kaipara being a territory/child of Northland and Hauraki in Waikato )
    await Opportunity.create({
      name: 'Kaipara District op',
      locations: ['Kaipara District', 'Hauraki District'],
      status: OpportunityStatus.ACTIVE,
      requestor: john._id
    })

    const p1 = {
      _id: mongoose.Types.ObjectId(),
      locations: ['Wellington', 'Northland']
    }

    let recommendedOps = await getLocationRecommendations(p1)
    t.is(recommendedOps.length, 3)
    t.is(recommendedOps[0].name, 'Hauraki District op') // closest match.

    const p2 = {
      _id: mongoose.Types.ObjectId(),
      locations: ['Waikato', 'Wellington']
    }

    recommendedOps = await getLocationRecommendations(p2)
    t.is(recommendedOps.length, 3)
    t.is(recommendedOps[0].name, 'Hauraki District op') // closest match.

    const p3 = {
      _id: mongoose.Types.ObjectId(),
      locations: ['Auckland', 'Waikato']
    }

    recommendedOps = await getLocationRecommendations(p3)
    t.is(recommendedOps.length, 2)
    t.is(recommendedOps[0].name, 'Hauraki District op') // closest match.
  }
)

/**
 *
 * Tests for recommendations based on interests
 *
 **/

test.serial('getSkillsRecommendations > no opportunities', async (t) => {
  await Opportunity.deleteMany()

  const recommendedSkills = await getSkillsRecommendations({
    _id: mongoose.Types.ObjectId(),
    role: Role.VOLUNTEER,
    tags: ['programming'],
    topicGroups: ['business']
  })
  t.deepEqual(recommendedSkills, [])
})

test.serial(
  'getSkillsRecommendations > no tags, no topic groups',
  async (t) => {
    const recommendedSkills = await getSkillsRecommendations({
      _id: mongoose.Types.ObjectId(),
      role: Role.VOLUNTEER,
      tags: [],
      topicGroups: []
    })
    t.deepEqual(recommendedSkills, [])
  }
)

test.serial(
  'getSkillsRecommendations > no tags match, no topic group match',
  async (t) => {
    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    await Opportunity.deleteMany()
    const opTags = getRandomTags(fixtures.tagCategories.technology.tags, 5)
    // Add a topic group tag
    opTags.push('community')

    await Opportunity.create({
      name: 'Technology opportunity',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    const userTags = await getRandomTags(
      fixtures.tagCategories.business.tags,
      5
    )
    const person = {
      _id: mongoose.Types.ObjectId(),
      role: Role.VOLUNTEER,
      tags: userTags,
      topicGroups: ['business']
    }

    const recommendedSkills = await getSkillsRecommendations(person)
    t.deepEqual(recommendedSkills, [])
  }
)

test.serial(
  'getSkillsRecommendations > user has no tags, topic group match',
  async (t) => {
    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    await Opportunity.deleteMany()
    const opTags = getRandomTags(fixtures.tagCategories.technology.tags, 5)

    // Add a topic group tag
    opTags.push('education')
    await Opportunity.create({
      name: 'Technology opportunity no topic group matches',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    // Add a topic group tag
    opTags.push('business')
    await Opportunity.create({
      name: 'Technology opportunity 1 topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    // Add another topic group tag
    opTags.push('community')
    await Opportunity.create({
      name: 'Technology opportunity 2 topic group matches',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    const person = {
      _id: mongoose.Types.ObjectId(),
      role: Role.VOLUNTEER,
      tags: [],
      topicGroups: ['business', 'community']
    }

    const recommendedSkills = await getSkillsRecommendations(person)
    t.is(recommendedSkills.length, 2)
    t.is(
      recommendedSkills[0].name,
      'Technology opportunity 2 topic group matches'
    ) // closest match.
    t.is(
      recommendedSkills[1].name,
      'Technology opportunity 1 topic group match'
    ) // second closest match.
  }
)

test.serial(
  'getSkillsRecommendations > no tag matches, topic group match',
  async (t) => {
    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    await Opportunity.deleteMany()
    const opTags = getRandomTags(fixtures.tagCategories.technology.tags, 5)

    // Add a topic group tag
    opTags.push('education')
    await Opportunity.create({
      name: 'Technology opportunity no topic group matches',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    // Add a topic group tag
    opTags.push('business')
    await Opportunity.create({
      name: 'Technology opportunity 1 topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    // Add another topic group tag
    opTags.push('community')
    await Opportunity.create({
      name: 'Technology opportunity 2 topic group matches',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    const userTags = await getRandomTags(
      fixtures.tagCategories.business.tags,
      5
    )
    const person = {
      _id: mongoose.Types.ObjectId(),
      role: Role.VOLUNTEER,
      tags: userTags,
      topicGroups: ['business', 'community']
    }

    const recommendedSkills = await getSkillsRecommendations(person)
    t.is(recommendedSkills.length, 2)
    t.is(
      recommendedSkills[0].name,
      'Technology opportunity 2 topic group matches'
    ) // closest match.
    t.is(
      recommendedSkills[1].name,
      'Technology opportunity 1 topic group match'
    ) // second closest match.
  }
)

test.serial.failing(
  'getSkillsRecommendations > partial tag matches, no topic group matches',
  async (t) => {
    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    await Opportunity.deleteMany()
    const opTags = ['community']

    await Opportunity.create({
      name: 'Op with no tag match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('remote business')
    await Opportunity.create({
      name: 'Op with one partial match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('remote work')
    await Opportunity.create({
      name: 'Op with two partial matches',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('tutor')
    await Opportunity.create({
      name: 'Op with three partial matches',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    const person = {
      _id: mongoose.Types.ObjectId(),
      role: Role.VOLUNTEER,
      tags: ['remote', 'work', 'tutoring'],
      topicGroups: ['business']
    }

    const recommendedSkills = await getSkillsRecommendations(person)
    t.is(recommendedSkills.length, 4)
    t.is(recommendedSkills[0].name, 'Op with three partial matches') // closest match.
    t.is(recommendedSkills[2].name, 'Op with one partial match') // least close match
    t.is(recommendedSkills[3].name, 'Op with no tag match') // no match, ranked last
  }
)

test.serial.failing(
  'getSkillsRecommendations > alias tag matches, no topic group matches',
  async (t) => {
    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    await Opportunity.deleteMany()
    const opTags = ['community']

    await Opportunity.create({
      name: 'Op with no tag match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('coding')
    await Opportunity.create({
      name: 'Op with one alias match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('tutor')
    await Opportunity.create({
      name: 'Op with two alias matches',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('law')
    await Opportunity.create({
      name: 'Op with three alias matches',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    const person = {
      _id: mongoose.Types.ObjectId(),
      role: Role.VOLUNTEER,
      tags: ['programming', 'teacher', 'legal'],
      topicGroups: ['business']
    }

    const recommendedSkills = await getSkillsRecommendations(person)
    t.is(recommendedSkills.length, 3)
    t.is(recommendedSkills[0].name, 'Op with three alias matches') // closest match.
    t.is(recommendedSkills[2].name, 'Op with one alias match') // least close match
  }
)

test.serial(
  'getSkillsRecommendations > full tag matches, no topic group matches',
  async (t) => {
    await Person.deleteMany()
    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    await Opportunity.deleteMany()
    const opTags = ['community']

    await Opportunity.create({
      name: 'Op with no tag match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('coding')
    await Opportunity.create({
      name: 'Op with one full match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('tutor')
    await Opportunity.create({
      name: 'Op with two full matches',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('law')
    await Opportunity.create({
      name: 'Op with three full matches',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    const person = {
      _id: mongoose.Types.ObjectId(),
      role: Role.VOLUNTEER,
      tags: ['coding', 'tutor', 'law', 'random'],
      topicGroups: ['business']
    }

    const recommendedSkills = await getSkillsRecommendations(person)
    t.is(recommendedSkills.length, 3)
    t.is(recommendedSkills[0].name, 'Op with three full matches') // closest match.
    t.is(recommendedSkills[2].name, 'Op with one full match') // least close match
  }
)

test.serial.failing(
  'getSkillsRecommendations > partial tag matches, topic group matches',
  async (t) => {
    await Person.deleteMany()
    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    await Opportunity.deleteMany()
    const opTags = ['community']

    await Opportunity.create({
      name: 'Op with no tag match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('coding')
    await Opportunity.create({
      name: 'Op with one partial match, no topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('tutor')
    await Opportunity.create({
      name: 'Op with two partial matches, no topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('business')
    await Opportunity.create({
      name: 'Op with one partial match and a topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('law')
    await Opportunity.create({
      name: 'Op with two partial matches and a topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    const person = {
      _id: mongoose.Types.ObjectId(),
      role: Role.VOLUNTEER,
      tags: ['coder', 'tutoring', 'lawyer', 'random'],
      topicGroups: ['business']
    }

    const recommendedSkills = await getSkillsRecommendations(person)
    t.is(recommendedSkills.length, 4)
    t.is(
      recommendedSkills[0].name,
      'Op with two partial matches and a topic group match'
    ) // closest match.
    t.is(
      recommendedSkills[1].name,
      'Op with one partial match and a topic group match'
    ) // closest match.
    t.is(
      recommendedSkills[3].name,
      'Op with one partial match, no topic group match'
    ) // least close match
  }
)

test.serial.failing(
  'getSkillsRecommendations > alias tag matches, topic group matches',
  async (t) => {
    await Person.deleteMany()
    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    await Opportunity.deleteMany()
    const opTags = ['community']

    await Opportunity.create({
      name: 'Op with no tag match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('coding')
    await Opportunity.create({
      name: 'Op with one alias match, no topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('business')
    await Opportunity.create({
      name: 'Op with one alias match and a topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    opTags.push('law')
    await Opportunity.create({
      name: 'Op with two alias matches and a topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    const person = {
      _id: mongoose.Types.ObjectId(),
      role: Role.VOLUNTEER,
      tags: ['programming', 'tutoring', 'legal', 'random'],
      topicGroups: ['business']
    }

    const recommendedSkills = await getSkillsRecommendations(person)
    t.is(recommendedSkills.length, 3)
    t.is(
      recommendedSkills[0].name,
      'Op with two alias matches and a topic group match'
    ) // closest match.
    t.is(
      recommendedSkills[2].name,
      'Op with one alias match, no topic group match'
    ) // least close match
  }
)

test.serial(
  'getSkillsRecommendations > full tag matches, topic group matches',
  async (t) => {
    await Person.deleteMany()
    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    await Opportunity.deleteMany()
    const opTags = ['community']
    const tags = await getRandomTags(fixtures.tagCategories.business.tags, 5)

    await Opportunity.create({
      name: 'Op with no tag match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: opTags
    })

    await Opportunity.create({
      name: 'Op with one full match, no topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: tags.slice(0, 1).concat(opTags)
    })

    opTags.push('business')
    await Opportunity.create({
      name: 'Op with one full match and a topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: tags.slice(0, 1).concat(opTags)
    })

    // Check handling of equal ranking between the ops
    await Opportunity.create({
      name: 'Another op with one full match and a topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: tags.slice(0, 1).concat(opTags)
    })

    await Opportunity.create({
      name: 'Op with two full matches and a topic group match',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: tags.slice(0, 2).concat(opTags)
    })

    const person = {
      _id: mongoose.Types.ObjectId(),
      role: Role.VOLUNTEER,
      tags: tags,
      topicGroups: ['business']
    }

    const recommendedSkills = await getSkillsRecommendations(person)
    t.is(recommendedSkills.length, 4)
    t.is(
      recommendedSkills[0].name,
      'Op with two full matches and a topic group match'
    ) // closest match.
    t.is(
      recommendedSkills[1].name,
      'Op with one full match and a topic group match'
    )
    t.is(
      recommendedSkills[2].name,
      'Another op with one full match and a topic group match'
    )
    t.is(
      recommendedSkills[3].name,
      'Op with one full match, no topic group match'
    ) // least close match
  }
)

test.serial.failing(
  'getSkillsRecommendations > mixture of partial, alias, and full matches',
  async (t) => {
    await Person.deleteMany()
    const john = await Person.create({
      name: 'John',
      email: 'john@mail.com'
    })

    const userTags = ['tutor', 'remote', 'marketing']
    const person = {
      _id: mongoose.Types.ObjectId(),
      role: Role.VOLUNTEER,
      tags: userTags,
      topicGroups: []
    }

    await Opportunity.deleteMany()
    await Opportunity.create({
      name: 'Fully matched op',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: userTags
    })

    await Opportunity.create({
      name: 'Op with full match, partial match, and alias match of distinct tags',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: ['tutor', 'remote learning', 'advertising']
    })

    await Opportunity.create({
      name: 'Op with full match, and partial matches of distinct tags',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: ['tutor', 'remote learning', 'markets']
    })

    await Opportunity.create({
      name: 'Op with alias matches of distinct tags',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: ['teaching', 'distant', 'advertising']
    })

    await Opportunity.create({
      name: 'Op with full match, and multiple partial matches of the same tag',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: ['tutor', 'remote learning', 'remote working']
    })

    await Opportunity.create({
      name: 'Op with full match, and multiple alias matches of the same tag',
      status: OpportunityStatus.ACTIVE,
      type: OpportunityType.OFFER,
      requestor: john._id,
      tags: ['tutor', 'marketing', 'seo']
    })

    const recommendedSkills = await getSkillsRecommendations(person)
    t.is(recommendedSkills.length, 6)
    t.is(
      recommendedSkills[0].name,
      'Fully matched op'
    ) // closest match.
    // TODO: Add ranking checks once the scoring system is in place
  }
)

/**
 * Select random tags from the array
 * @param {} tagArr array of tags
 * @param {*} numOfElements number of elements to be selected
 */
function getRandomTags (tagArr, numOfElements) {
  const shuffledArr = tagArr.sort(() => 0.5 - Math.random())
  return shuffledArr.slice(0, numOfElements)
}
