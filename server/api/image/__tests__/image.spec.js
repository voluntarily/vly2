import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import fs from 'fs-extra'
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  try {
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

test.serial('Upload image - anonymous', async t => {
  const response = await sendImageToAPI(__dirname, '194px-Testcard_F.jpg')
  t.is(response.statusCode, 403)
})

test.serial('Upload image - authenticated', async t => {
  const res = await sendImageToAPI(__dirname, '194px-Testcard_F.jpg')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
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

    t.is(img.body.length, 15185)
  }
})

test.serial('Empty image should fail to upload', async t => {
  const res = await request(server)
    .post('/api/images')
    .set('content-type', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send(JSON.stringify({ image: {}, file: 'okfilename' }))
    .expect('Content-Type', /json/)
  t.is(res.status, 400)
})
