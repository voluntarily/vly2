import test from 'ava'
import MockExpressRequest from 'mock-express-request'
import MockResponse from 'mock-res'
import sinon from 'sinon'
import { initializeTags, initializeGroups } from '../initTags'
import { startMongo, stopMongo } from '../mockMongo'

import { appReady } from '../../server'
import Tag from '../../api/tag/tag'
const { DefaultTagList, GroupTagList } = require('../../api/tag/tag.constants')

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  await appReady
})

test('Add tags to DB if needed', async t => {
  const p1 = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    // email: 'Testy555@voluntarily.nz', <- explicity remove email
    role: ['opportunityProvider'],
    tags: ['taga', 'tagb']
  }

  const p2 = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    // email: 'Testy555@voluntarily.nz', <- explicity remove email
    role: ['opportunityProvider'],
    tags: ['taga', 'tagc']
  }

  const request1 = new MockExpressRequest()
  request1.body = p1
  const request2 = new MockExpressRequest()
  request2.body = p2

  const response = new MockResponse()
  const next = sinon.fake()

  try {
    await initializeTags(request1, response, next)
    t.true(next.calledOnce)
    await initializeTags(request2, response, next)
    t.is(next.callCount, 2)

    const tags = await Tag.findOne({ name: DefaultTagList })
    t.is(tags.tags.length, 3)
    t.deepEqual(Array.from(tags.tags), ['taga', 'tagb', 'tagc'])
  } catch (err) {
    console.error('api/people err', err, err.stack)
  }
})

test('Add tags to groups list if needed', async t => {
  const p1 = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    // email: 'Testy555@voluntarily.nz', <- explicity remove email
    role: ['opportunityProvider'],
    tags: ['groupa', 'groupb']
  }

  const p2 = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    // email: 'Testy555@voluntarily.nz', <- explicity remove email
    role: ['opportunityProvider'],
    tags: ['groupa', 'groupc']
  }

  const request1 = new MockExpressRequest()
  request1.body = p1
  const request2 = new MockExpressRequest()
  request2.body = p2

  const response = new MockResponse()
  const next = sinon.fake()

  try {
    await initializeGroups(request1, response, next)
    t.true(next.calledOnce)
    await initializeGroups(request2, response, next)
    t.is(next.callCount, 2)

    const groups = await Tag.findOne({ name: GroupTagList })
    t.deepEqual(Array.from(groups.tags), ['groupa', 'groupb', 'groupc'])
  } catch (err) {
    console.error('api/people err', err, err.stack)
  }
})
