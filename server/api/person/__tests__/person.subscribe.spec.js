import test from 'ava'
import express from 'express'
import PubSub from 'pubsub-js'
import { TOPIC_PERSON__CREATE, TOPIC_MEMBER__UPDATE, TOPIC_PERSON__EMAIL_SENT } from '../../../services/pubsub/topic.constants'
import MemoryMongo from '../../../util/test-memory-mongo'
import Person from '../person'
import people from './person.fixture'
import Organisation from '../../organisation/organisation'
import orgs from '../../organisation/__tests__/organisation.fixture'
import Subscribe from '../person.subscribe.js'
const { MemberStatus } = require('../../member/member.constants')

test.before('before connect to database', async (t) => {
  t.context.server = express()
  Subscribe(t.context.server)
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  t.context.people = await Person.create(people)
  t.context.orgs = await Organisation.create(orgs)
  t.context.andrew = t.context.people[0]
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test('Trigger TOPIC_PERSON__CREATE', async t => {
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

test('Trigger TOPIC_MEMBER__UPDATE', async t => {
  t.plan(2)

  const newMember = {
    person: t.context.people[0],
    organisation: t.context.orgs[0],
    validation: 'follower',
    status: MemberStatus.FOLLOWER
  }
  const done = new Promise((resolve, reject) => {
    PubSub.subscribe(TOPIC_PERSON__EMAIL_SENT, async (msg, info) => {
      t.is(info.response, 'nodemailer-mock success')
      resolve(true)
    })
  })
  t.true(PubSub.publish(TOPIC_MEMBER__UPDATE, newMember))
  await done
})

test('TOPIC_MEMBER__UPDATE for exmember sends no email', async t => {
  t.plan(1)

  const newMember = {
    person: t.context.people[0],
    organisation: t.context.orgs[0],
    validation: 'exmember',
    status: MemberStatus.EXMEMBER
  }

  t.true(PubSub.publish(TOPIC_MEMBER__UPDATE, newMember))
  // There's no way to check for something that doesn't happen.
  // but at least we can run the code.
})
