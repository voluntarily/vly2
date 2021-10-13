import test from 'ava'
import { Interest } from '../interest'
import MemoryMongo from '../../../util/test-memory-mongo'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import Opportunity from '../../opportunity/opportunity'
import ops from '../../opportunity/__tests__/opportunity.fixture'
import Organisation from '../../organisation/organisation'
import orgs from '../../organisation/__tests__/organisation.fixture'
import { personInterestCount, getInterestDetail } from '../interest.lib'
import { InterestStatus } from '../interest.constants'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  t.context.people = await Person.create(people)
  t.context.orgs = await Organisation.create(orgs)
  t.context.me = t.context.people[0] // I am the first person.
  t.context.dali = t.context.people[1]
  t.context.alice = t.context.people[2]

  // setup opportunities 5 items
  ops.forEach((op, index) => {
    // each op has a different person as requestor, but not me
    op.requestor = t.context.people[index + 1]
    // all the ops belong to the OMGTech org
    op.offerOrg = t.context.orgs[1]
  })
  t.context.ops = await Opportunity.create(ops)

  // setup interests
  // each op has person + 2 interested.
  const interests = t.context.ops.map((op, index) => {
    const enquirer = t.context.people[index + 2]
    const opr = op.requestor
    return {
      person: enquirer._id,
      opportunity: op._id,
      // comment: `${index} ${enquirer.nickname} interested in ${op.name}`
      messages: [{ // this works whether its an object or array.
        body: `${enquirer.name} has a message for ${opr.name}`,
        author: enquirer._id
      },
      { // this works whether its an object or array.
        body: `${opr.name} has a message for ${enquirer.name}`,
        author: opr._id
      }]
    }
  })
  t.context.interests = await Interest.create(interests)
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

test('getInterestDetail returns full information including messages', async t => {
  const dets = await getInterestDetail(t.context.interests[0]._id)
  t.is(dets.status, InterestStatus.INTERESTED)
  t.is(dets.person.name, t.context.people[2].name)
  t.is(dets.opportunity.name, t.context.ops[0].name)
  t.is(dets.opportunity.requestor.email, t.context.people[1].email)
  t.is(dets.messages.length, 2)
  t.is(dets.messages[0].author.nickname, t.context.people[2].nickname)
})
