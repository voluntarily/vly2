import test from 'ava'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import MemoryMongo from '../../../server/util/test-memory-mongo'
import { OpportunityType } from '../../../server/api/opportunity/opportunity.constants'

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
    Person: 0,
    Activity: 0,
    Interest: 0,
    Opportunity: { [OpportunityType.ASK]: 0, [OpportunityType.OFFER]: 0 }
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
