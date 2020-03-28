import test from 'ava'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import MemoryMongo from '../../../server/util/test-memory-mongo'

import summary from '../../../pages/api/reports/summary'

test.before('start in memory mongo and create fake server', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  t.context.memMongo && (await t.context.memMongo.stop())
})

test('Should respond with summary data for an admin', async t => {
  const req = new MockExpressRequest()
  const res = new MockExpressResponse()
  req.session = {
    isAuthenticated: true,
    me: { role: ['admin'] }
  }

  await summary(req, res)
  t.deepEqual(res._getJSON(), {
    Person: { total: 0 },
    Activity: { total: 0 },
    Interest: { total: 0, status: {} },
    Member: { total: 0, status: {} },
    Opportunity: { total: 0, type: {} },
    Organisation: { total: 0, role: {} }
  })
  t.is(200, res.statusCode, 'OK Response')
})

test('Should require the logged in user is an admin', async t => {
  const req = new MockExpressRequest()
  const res = new MockExpressResponse()
  req.session = {}
  await summary(req, res)
  t.is(401, res.statusCode, 'Authorisation required')
})
