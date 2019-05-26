import test from 'ava'
import request from 'supertest'
import { server } from '../../../server'

test.serial('Should correctly save an image', async t => {
  const result = await request(server)
    .post('/api/postImage')
    .send({
      // Image location here
    })
    .set('Accept', 'application/json')
  t.is(result.status, 200)
})
