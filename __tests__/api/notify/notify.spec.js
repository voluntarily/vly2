import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server/server'
import MemoryMongo from '../../../server/util/test-memory-mongo'
import orgs from '../../../server/api/organisation/organisation.fixture.js'

test.before('before connect to database', async (t) => {
  try {
      t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
    await appReady
    await Organisation.create(orgs).catch(() => 'Unable to create orgs')
  } catch (e) { console.error('organisation.spec.js before error:', e) }

})

test('trigger an org inviteMember email', async t => {
  const url = `/api/notify/org/5d9fe64b4eb179218c8d1d30?memberStatus=member&memberValidation=%27email%20invitation%27
  const res = await request(server)
    .get('/api/health')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)

  const health = res.body
  t.is(health.health, 'OK')
})
