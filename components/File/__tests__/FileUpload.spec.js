import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server/server'
import MemoryMongo from '../../../server/util/test-memory-mongo'
import fs from 'fs-extra'
import path from 'path'
import { jwtData } from '../../../server/middleware/session/__tests__/setSession.fixture'
import { config } from '../../../config/serverConfig'
import glob from 'glob'
import { v4 as uuid } from 'uuid'

test.before(async t => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
})

test.serial('Upload denied for anonymous', async t => {
  const data = fs.readFileSync(path.join(__dirname, 'resources/file-sample_150kB.pdf'), {
    encoding: null
  })

  // Force the file.controller to use the filesystem to store files
  config.env = 'development'

  const res = await request(server)
    .post('/api/files')
    .send({
      filename: 'file-sample_150kB.pdf',
      data
    })

  t.is(res.status, 403)
  t.falsy(res.body.location)
})

test.serial('Upload and retrieve file via the filesystem', async t => {
  const data = fs.readFileSync(path.join(__dirname, 'resources/file-sample_150kB.pdf'), {
    encoding: null
  })

  // Force the file.controller to use the filesystem to store files
  config.env = 'development'

  const uniq = `${uuid()}`.substr(0, 8)

  try {
    const res = await request(server)
      .post('/api/files')
      .set('Cookie', [`idToken=${jwtData.idToken}`])
      .send({
        filename: `file-sample_150kB-${uniq}.pdf`,
        data
      })

    t.is(res.status, 200)
    t.truthy(res.body.location)

    const getRes = await request(server)
      .get(res.body.location)

    t.is(getRes.status, 200)
    t.is(getRes.body.length, 142786)
    t.regex(res.body.location, /\.pdf$/)
  } finally {
    // Delete test upload file by finding it using the 'uniq' part of its name
    glob(`*${uniq}.pdf`, {
      cwd: 'public/static/upload'
    }, (err, files) => {
      if (!err && files.length > 0) {
        fs.unlinkSync(`public/static/upload/${files[0]}`)
      }
    })
  }
})
