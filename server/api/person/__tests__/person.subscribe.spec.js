import test from 'ava'
import express from 'express'
import PubSub from 'pubsub-js'
import { TOPIC_PERSON__CREATE, TOPIC_PERSON__EMAIL_SENT } from '../../../services/pubsub/topic.constants'
import MemoryMongo from '../../../util/test-memory-mongo'
import Person from '../person'
import people from './person.fixture'
import Subscribe from '../person.subscribe.js'

test.before('before connect to database', async (t) => {
  try {
    t.context.server = express()
    Subscribe(t.context.server)
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
    t.context.people = await Person.create(people).catch((err) => console.error('Unable to create people:', err))
    t.context.andrew = t.context.people[0]
  } catch (e) {
    console.error('personController.spec.js, before connect to database', e)
  }
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.serial('Trigger TOPIC_PERSON__CREATE', async t => {
  t.plan(2)

  const newPerson = t.context.people[0]
  const done = new Promise((resolve, reject) => {
    PubSub.subscribe(TOPIC_PERSON__EMAIL_SENT, async (msg, info) => {
      t.is(info.response, 'nodemailer-mock success')
      resolve(true)
    })
  })
  t.true(PubSub.publish(TOPIC_PERSON__CREATE, newPerson))
  await done
})
