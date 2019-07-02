import test from 'ava'
// import request from 'supertest'
import { appReady } from '../../server'
import Person from '../../api/person/person'
import Opportunity from '../../api/opportunity/opportunity'
import MemoryMongo from '../test-memory-mongo'
import { initDB } from './test.utils.spec'
// import {shallow} from 'enzyme'

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach(initDB)

test.afterEach.always(async () => {
  await Person.deleteMany()
  await Opportunity.deleteMany()
})

test.serial('database has loaded the people fixture', async t => {
  const count = await Person.countDocuments()
  // console.log(count)
  t.is(count, t.context.people.length)
  t.is(t.context.people[0].nickname, 'avowkind')
})

test.serial('database has ops with requestors', async t => {
  const count = await Opportunity.countDocuments()
  t.is(count, t.context.ops.length)
  t.is(t.context.ops[0].requestor.nickname, 'avowkind')
})
