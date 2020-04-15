import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'

const locationData = require('../locationData')

test.before('wait for server to be ready', async (t) => {
  await appReady
})

test.serial('Should return the correct location data', async t => {
  const res = await request(server)
    .get('/api/locations')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)

  t.is(res.body.length, locationData.sortedLocations.length)
})
