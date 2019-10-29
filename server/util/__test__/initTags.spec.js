import test from 'ava'
import MockExpressRequest from 'mock-express-request'
import MockResponse from 'mock-res'
import sinon from 'sinon'
import initializeTags from '../initTags'
import MemoryMongo from '../test-memory-mongo'
import { appReady } from '../../server'
import Tag from '../../api/tag/tag'

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.serial('Add tags to DB if needed', async t => {
  t.plan(5)
  const p1 = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    // email: 'Testy555@voluntarily.nz', <- explicity remove email
    role: ['tester'],
    tags: ['taga', 'tagb']
  }

  const p2 = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    // email: 'Testy555@voluntarily.nz', <- explicity remove email
    role: ['tester'],
    tags: ['taga', 'tagc']
  }

  const request1 = new MockExpressRequest()
  request1.body = p1
  const request2 = new MockExpressRequest()
  request2.body = p2

  const response = new MockResponse()
  // response.sendStatus = (status) => { fakeSendStatus() }

  const next = sinon.fake()

  try {
    await initializeTags(request1, response, next)
    t.true(next.calledOnce)
    await initializeTags(request2, response, next)
    t.is(next.callCount, 2)

    await Tag.find().then(tags => {
      console.log('find', tags, tags[0])

      t.is(tags.length, 1)
      console.log('got tags', tags[0].tags)
      t.is(Array.from(tags[0].tags), ['taga', 'tagb', 'tagc'])
    })

    t.is(response.statusCOde, 200)
  } catch (err) {
    console.error('api/people err', err, err.stack)
  }
})
