/* Where is this ECONRESET coming from  ? */

import test from 'ava'
import request from 'supertest'
import MemoryMongo from '../../../util/test-memory-mongo'
import { server, appReady } from '../../../server'
import Opportunity from '../opportunity'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

/* Demonstrates that we can create a valid Op with only the minimum required fields
other fields are either optional or defaulted - including tags.
*/
test.serial('Should save an op with no tags', async t => {
  const op = new Opportunity({
    name: 'Op with No tags',
    // tags: tags,
    requestor: t.context.people[0]._id
  })

  const res = await op.save()
  console.log(res)
  const q = await Opportunity.findOne({ name: 'Op with No tags' })
  t.deepEqual(q && q.requestor, t.context.people[0]._id)
})

/* Demonstrates that sending the same op above through the API causes the system to
hang and catch fire. / ECONRESET
*/
test.serial('Should be able to upload an op with no tags', async t => {
  const op = {
    name: 'Op with No tags',
    // tags: [], // uncomment this and test passes.
    requestor: t.context.people[0]._id
  }

  const res = await request(server)
    .post('/api/opportunities')
    .send(op)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)

  const q = await Opportunity.findOne({ name: 'Op with No tags' })
  t.deepEqual(q && q.requestor, t.context.people[0]._id)
})
