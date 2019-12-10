import test from 'ava'
import Person from '../person'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from './person.fixture'
import Subscribe from '../person.subscribe'
import express from 'express'
import PubSub from 'pubsub-js'
import { TOPIC_PERSON__CREATE } from '../../../services/pubsub/topic.constants'

test.before('before connect to database', async (t) => {
  try {
    t.context.server = express()
    Subscribe(t.context.server)
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
    t.context.people = await Person.create(people).catch((err) => console.error('Unable to create people:', err))
  } catch (e) {
    console.error('personController.spec.js, before connect to database', e)
  }
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.serial('Trigger PubSub', async t => {
  // t.plan(2)
  const newPerson = t.context.people[0]

  t.true(await PubSub.publish(TOPIC_PERSON__CREATE, newPerson))
  // TODO: validate that the goal cards have been allocated.
})
