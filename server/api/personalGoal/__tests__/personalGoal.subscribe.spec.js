import test from 'ava'
import express from 'express'
import PubSub from 'pubsub-js'
import { TOPIC_GOALGROUP__ADD, TOPIC_MEMBER__UPDATE, TOPIC_PERSON__CREATE } from '../../../services/pubsub/topic.constants'
import MemoryMongo from '../../../util/test-memory-mongo'
import Goal from '../../goal/goal'
import goals from '../../goal/__tests__/goal.fixture'
import { MemberStatus } from '../../member/member.constants'
import Organisation from '../../organisation/organisation'
import orgs from '../../organisation/__tests__/organisation.fixture'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import PersonalGoal from '../personalGoal'
import Subscribe from '../personalGoal.subscribe'

test.before('before connect to database', async (t) => {
  try {
    t.context.server = express()
    Subscribe(t.context.server)
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
    t.context.people = await Person.create(people).catch((err) => console.error('Unable to create people:', err))
    t.context.goals = await Goal.create(goals).catch((e) => console.error('Unable to create goals', e))
    t.context.orgs = await Organisation.create(orgs).catch((err) => `Unable to create organisations: ${err}`)
    t.context.org = t.context.orgs[0]
    t.context.andrew = t.context.people[0]
  } catch (e) {
    console.error('personController.spec.js, before connect to database', e)
  }
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.serial('Trigger TOPIC_PERSON__CREATE', async t => {
  t.plan(3)

  const newPerson = t.context.people[0]
  let pgs = await PersonalGoal.find().exec()
  const len = pgs.length
  const done = new Promise((resolve, reject) => {
    PubSub.subscribe(TOPIC_GOALGROUP__ADD, async (msg, gg) => {
      t.is(gg.length, 3)
      pgs = await PersonalGoal.find().exec()
      t.is(pgs.length, len + 3)
      resolve(true)
    })
  })
  t.true(PubSub.publish(TOPIC_PERSON__CREATE, newPerson))
  await done
})

test.serial('Trigger TOPIC_MEMBER__UPDATE', async t => {
  t.plan(3)
  const member = {
    person: t.context.andrew._id,
    organisation: t.context.orgs[1]._id,
    validation: 'Trigger TOPIC_MEMBER__UPDATE',
    status: MemberStatus.ORGADMIN
  }
  const pgs = await PersonalGoal.find().exec()
  const len = pgs.length
  const done = new Promise((resolve, reject) => {
    PubSub.subscribe(TOPIC_GOALGROUP__ADD, async (msg, gg) => {
      t.is(gg.length, 3)
      const pgs = await PersonalGoal.find().exec()
      t.is(pgs.length, len + 3)
      resolve(true)
    })
  })
  t.true(PubSub.publish(TOPIC_MEMBER__UPDATE, member))
  await done
})
