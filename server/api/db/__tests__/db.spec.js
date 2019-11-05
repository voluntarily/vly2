import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'

import Opportunity from '../../opportunity/opportunity'
import Person from '../../person/person'
import Organisation from '../../organisation/organisation'
import Activity from '../../activity/activity'

import ops from '../../opportunity/__tests__/opportunity.fixture'
import orgs from '../../organisation/__tests__/organisation.fixture'
import people from '../../person/__tests__/person.fixture'
import acts from '../../activity/__tests__/activity.fixture'

test.before('Setup fixtures and database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady

  const orrgs = await Organisation.create(orgs).catch(() => 'Unable to create orgs')
  people.forEach(p => {
    p.avatar = p.imgUrl
    delete p.imgUrl
  })
  const peeps = await Person.create(people).catch(() => 'Unable to create people')
  ops.forEach(op => {
    op.requestor = peeps[0]
    op.offerOrg = orrgs[0]
    op.title = op.name
    delete op.name
  })
  await Opportunity.create(ops).catch(() => 'Unable to create ops')
  await Activity.create(acts).catch(() => 'Unable to create acts')
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.serial('put message in logfile', async t => {
  const res = await request(server)
    .get('/api/db/log?msg="Hello"')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body

  t.is(got.message, 'DB Action log')
})

test.serial(' list entities', async t => {
  const log = console.log
  console.log = () => {} // temp silence the log output
  let res = await request(server)
    .get('/api/db/list?e=Person')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  t.is(res.body.message, 'DB Action list')
  res = await request(server)
    .get('/api/db/list?e=Organisation')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  t.is(res.body.message, 'DB Action list')

  res = await request(server)
    .get('/api/db/list?e=Opportunity')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  t.is(res.body.message, 'DB Action list')
  res = await request(server)
    .get('/api/db/list?e=Activity')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  t.is(res.body.message, 'DB Action list')

  console.log = log
})

/* this currently generates a db exception */
test.skip(' fixName entities', async t => {
  const res = await request(server)
    .get('/api/db/fixName?e=Person')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  t.is(res.body.message, 'DB Action fixName')
})
