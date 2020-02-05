import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import fs from 'fs-extra'

test.before('before connect to database', async (t) => {
  try {
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
    await appReady
    fs.emptyDirSync('public/static/upload-test')
  } catch (e) { console.error('image.spec.js error before', e) }
})

test.serial('can return image from static folder', async t => {
  const res = await request(server)
    .get('/static/img/194px-Testcard_F.jpg')
    .set('Accept', 'image')
    .expect(200)
    .expect('Content-Type', /image/)

  t.is(res.body.length, 15185)
})

const sendImageToAPI = (path, filename) => {
  const file = fs.readFileSync(`${path}/${filename}`)
  return request(server)
    .post('/api/images')
    .set('content-type', 'application/json')
    .send(JSON.stringify({ image: file, file: filename }))
}

test.serial.failing('Should upload a small file', async t => {
  const res = await sendImageToAPI(__dirname, '194px-Testcard_F.jpg')
    .expect(200)
    .expect('Content-Type', /json/)
  t.regex(res.body.imageUrl, /-194px-testcard_f_full\.png/i)

  // get the image back from server only if testing with local uploading storage
  if (!res.body.imageUrl.match(/https:\/\//gm)) {
    const img = await request(server)
      .get(res.body.imageUrl)
      .set('Accept', 'image')
      .expect(200)
      .expect('Content-Type', /image/)

    t.is(img.body.length, 64714)
  }
})

test.serial('Should fail to upload', async t => {
  const res = await request(server)
    .post('/api/images')
    .set('content-type', 'application/json')
    .send(JSON.stringify({ image: {}, file: 'okfilename' }))
    .expect('Content-Type', /json/)
  t.is(res.status, 400)
})
