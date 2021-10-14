import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server/server'
import { startMongo, stopMongo } from '../../../server/util/mockMongo'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  await appReady
})

test('Should respond to health check', async t => {
  const res = await request(server)
    .get('/api/health')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)

  const health = res.body
  t.is(health.health, 'OK')
})
