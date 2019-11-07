import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server/server'
import MemoryMongo from '../../../server/util/test-memory-mongo'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
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

