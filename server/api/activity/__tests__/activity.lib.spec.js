import test from 'ava'
import Activity from '../activity'
import Person from '../../person/person'
import Organisation from '../../organisation/organisation'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import people from '../../person/__tests__/person.fixture'
import orgs from '../../organisation/__tests__/organisation.fixture'
import tagList from '../../tag/__tests__/tag.fixture'
import acts from './activity.fixture.js'
import Opportunity from '../../opportunity/opportunity'
import { OpportunityStatus, OpportunityType } from '../../opportunity/opportunity.constants'
import cuid from 'cuid'
import { getOpsForActivity } from '../activity.lib'
// sequence generator
export const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))
export const gra = (min, max) => { return (Math.round(Math.random() * (max - min) + min)) }
export const coin = (a, b) => { return gra(0, 1) ? a : b }

const opCount = 10
const draftCount = 5
const activeCount = opCount - draftCount

const makeOp = (opStatus) => (fromActivity, index) => {
  return ({
    name: `${fromActivity.name} Opportunity ${cuid}`,
    imgUrl: fromActivity.imgUrl,
    subtitle: fromActivity.subtitle,
    description: fromActivity.description,
    duration: fromActivity.duration,
    location: 'Northland',
    type: coin(OpportunityType.ASK, OpportunityType.OFFER),
    status: opStatus,
    fromActivity: fromActivity._id,
    // offerOrg: fromActivity.offerOrg._id,
    requestor: fromActivity.owner._id,
    tags: ['one']
  })
}

const makeActiveOp = makeOp(OpportunityStatus.ACTIVE)
const makeDraftOp = makeOp(OpportunityStatus.DRAFT)

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  t.context.people = await Person.create(people)
  t.context.orgs = await Organisation.create(orgs)
  // connect each activity to an owner and org
  acts.forEach((act, index) => {
    act.owner = t.context.people[index]._id
    act.offerOrg = t.context.orgs[index]._id
    // each act has two consecutive tags from the list
    act.tags = [tagList[index], tagList[index + 1]]
  })

  t.context.activities = await Activity.create(acts)
  // create some ops from the act - we only care about type and fromAct
  t.context.ops = await Promise.all(t.context.activities.map(act => {
    const activeOps = Array(activeCount).fill({}).map(i => makeActiveOp(act, i))
    const draftOps = Array(draftCount).fill({}).map(i => makeDraftOp(act, i))
    return Opportunity.create([...activeOps, ...draftOps])
  }))
})

test.serial('verify fixture database has acts and ops', async t => {
  const count = await Activity.countDocuments()
  t.is(count, t.context.activities.length)
  // can find all
  const p = await Activity.find()
  t.is(t.context.activities.length, p.length)

  // can find by things
  const q = await Activity.findOne({ name: '4 The first 100 metres' })
  t.is(q && q.duration, '2 hours')
  t.is(q.slug, '4-the-first-100-metres')

  // can find ops
  const countOps = await Opportunity.countDocuments()
  t.is(countOps, opCount * t.context.activities.length)

  // can find active ops
  await Promise.all(t.context.activities.map(async act => {
    const counts = await getOpsForActivity(act._id)
    t.is(counts.ask + counts.offer, activeCount)
  }))
})
