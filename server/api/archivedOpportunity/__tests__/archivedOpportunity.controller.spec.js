
import test from 'ava'
import { server, appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import Tag from '../../tag/tag'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import archivedOps from './archivedOpportunity.fixture.js'
import tags from '../../tag/__tests__/tag.fixture'
import ArchiveOpportunity from '../archivedOpportunity'
import request from 'supertest'

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add two oppo entries', async (t) => {
  // connect each oppo to a requestor.
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.tags = await Tag.create(tags).catch((err) => `Unable to create tags: ${err}`)
  archivedOps.map((op, index) => { op.requestor = t.context.people[index]._id })
  t.context.opportunities = await ArchiveOpportunity.create(archivedOps).catch((err) => console.log('Unable to create opportunities', err))
})

test.serial('Should send correct data when queried against an _id', async t => {
  t.plan(4)

  const opp = new ArchiveOpportunity({
    title: 'The first 1000 metres',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: 'completed',
    tags: [t.context.tags[0]._id],
    requestor: t.context.people[1]._id
  })
  await opp.save()

  const person1 = t.context.people[1]
  const res = await request(server)
    .get(`/api/archivedOpportunities/${opp._id}`)
    .set('Accept', 'application/json')
  t.is(res.status, 200)
  t.is(res.body.title, opp.title)

  // verify requestor was populated out
  t.is(res.body.requestor.name, person1.name)

  // verify tag was populated out
  t.is(res.body.tags[0].tag, t.context.tags[0].tag)
})
