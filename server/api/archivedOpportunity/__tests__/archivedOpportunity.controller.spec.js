
import test from 'ava'
import { server, appReady } from '../../../server'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import archivedOps from './archivedOpportunity.fixture.js'
import tags from '../../tag/__tests__/tag.fixture'
import ArchiveOpportunity from '../archivedOpportunity'
import request from 'supertest'
import objectid from 'objectid'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  try {
    await appReady

    // connect each oppo to a requestor.
    t.context.people = await Person.create(people).catch((err) => console.error(`Unable to create people: ${err}`))
    archivedOps.forEach((op, index) => { op.requestor = t.context.people[index]._id })
    t.context.opportunities = await ArchiveOpportunity.create(archivedOps).catch((err) => console.error('Unable to create opportunities', err))
  } catch (e) {
    console.error('archivedOpportunity.controller.spec before connect error', e)
  }
})

test.serial('Should send correct data when queried against an _id', async t => {
  t.plan(3)

  const opp = new ArchiveOpportunity({
    name: 'The first 1000 metres',
    subtitle: 'Launching into space step 4',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 1000m',
    duration: '4 hours',
    location: 'Albany, Auckland',
    status: 'completed',
    tags: [tags[0]],
    requestor: t.context.people[1]._id
  })
  await opp.save()

  const person1 = t.context.people[1]
  const res = await request(server)
    .get(`/api/archivedOpportunities/${opp._id}`)
    .set('Accept', 'application/json')
  t.is(res.status, 200)
  t.is(res.body.name, opp.name)

  // verify requestor was populated out
  t.is(res.body.requestor.name, person1.name)
})

test.serial('Should return 404 when archivedOpportunity not found', async t => {
  t.plan(1)

  const res = await request(server)
    // Incorrect Opp ID
    .get(`/api/archivedOpportunities/${objectid()}`)
    .set('Accept', 'application/json')
  t.is(res.status, 404)
})
