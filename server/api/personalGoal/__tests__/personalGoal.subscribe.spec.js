import test from 'ava'
import Person from '../../person/person'
import PersonalGoal from '../personalGoal'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from '../../person/__tests__/person.fixture'
import Subscribe from '../personalGoal.subscribe'
import express from 'express'
import PubSub from 'pubsub-js'
import { TOPIC_PERSON__CREATE } from '../../../services/pubsub/topic.constants'
import Goal from '../../goal/goal'
import goals from '../../goal/__tests__/goal.fixture'

test.before('before connect to database', async (t) => {
  try {
    t.context.server = express()
    Subscribe(t.context.server)
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
    t.context.people = await Person.create(people).catch((err) => console.error('Unable to create people:', err))
    t.context.goals = await Goal.create(goals).catch((e) => console.error('Unable to create goals', e))
    // t.context.clock = sinon.useFakeTimers()
  } catch (e) {
    console.error('personController.spec.js, before connect to database', e)
  }
})

test.after.always(async (t) => {
  // t.context.clock.runAll()
  // t.context.clock.restore()
  await t.context.memMongo.stop()
})

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test.serial('Trigger PubSub', async t => {
  // t.plan(2)
  const newPerson = t.context.people[0]
  let pgs = await PersonalGoal.find()
  t.is(pgs.length, 0)

  t.true(PubSub.publishSync(TOPIC_PERSON__CREATE, newPerson))
  // validate that the goal cards have been allocated.
  while (pgs.length === 0) {
    await sleep(1)
    pgs = await PersonalGoal.find()
  }
  t.is(pgs.length, 2)
})
