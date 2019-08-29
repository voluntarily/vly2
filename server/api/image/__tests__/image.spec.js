import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import fs from 'fs'
import fsExtra from 'fs-extra'

test.after.always(() => {
  // clean out upload folder.
  fsExtra.emptyDirSync('./static/upload-test')
})

test.serial('can return image from static folder', async t => {
  await appReady
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

test.only('Should upload a small file', async t => {
  await appReady
  const res = await sendImageToAPI(__dirname, '194px-Testcard_F.jpg')
    .expect(200)
    .expect('Content-Type', /json/)
  // console.log(res)
  t.regex(res.body.imageUrl, /-194px-testcard_f[.]jpg/i)

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

test.serial('Should fail to upload', async t => {
  await appReady
  const res = await request(server)
    .post('/api/images')
    .set('content-type', 'application/json')
    .send(JSON.stringify({ image: {}, file: 'okfilename' }))
    .expect('Content-Type', /json/)
  t.is(res.status, 400)
})
