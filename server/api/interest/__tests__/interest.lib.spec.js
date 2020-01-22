import test from 'ava'
import Interest from '../interest'
import MemoryMongo from '../../../util/test-memory-mongo'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import Opportunity from '../../opportunity/opportunity'
import ops from '../../opportunity/__tests__/opportunity.fixture'
import Organisation from '../../organisation/organisation'
import orgs from '../../organisation/__tests__/organisation.fixture'
import { personInterestCount } from '../interest.lib'

test.before('before connect to database', async (t) => {
  try {
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
  } catch (e) {
    console.error('Interest.spec.js - error in test setup', e)
  }
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.orgs = await Organisation.create(orgs).catch((err) => `Unable to create organisations: ${err}`)
  t.context.me = t.context.people[0] // I am the first person.
  t.context.dali = t.context.people[1]
  t.context.alice = t.context.people[2]

  // setup opportunities 5 items
  ops.map((op, index) => {
    // each op has a different person as requestor, but not me
    op.requestor = t.context.people[index + 1]._id
    // all the ops belong to the OMGTech org
    op.offerOrg = t.context.orgs[1]._id
  })
  t.context.ops = await Opportunity.create(ops).catch((err) => console.error('Unable to create opportunities', err))

  // setup interests
  // each op has person + 2 interested.
  const interests = t.context.ops.map((op, index) => {
    const enquirer = t.context.people[index + 2]
    return {
      person: enquirer._id,
      opportunity: op._id,
      comment: `${index} ${enquirer.nickname} interested in ${op.name}`
    }
  })
  t.context.interests = await Interest.create(interests).catch(() => 'Unable to create interests')
})

test.afterEach.always(async (t) => {
  await Interest.deleteMany()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.serial('personInterestCount ', async t => {
  let count = await personInterestCount(t.context.me._id)
  t.is(count, 0)

  count = await personInterestCount(t.context.alice._id)
  t.is(count, 1)
})
