import test from 'ava'
import { config } from '../../../../config/serverConfig'
import fetchMock from 'fetch-mock'
import { getCloudcheck, postCloudcheck } from '../personalVerification.helpers'

test.beforeEach(t => {
  t.context.mockServer = fetchMock.sandbox()
  global.fetch = t.context.mockServer
})

test.afterEach(t => {
  fetchMock.reset()
})

test.serial('postCloudcheck works', async t => {
  t.context.mockServer.post(`${config.verification.cloudcheck.url}`, { body: { status: 200 } })

  const data = {
    key: 'myKey',
    data: '{test:"testtest"}'
  }

  await postCloudcheck({
    path: '',
    data
  })

  const lastOptions = t.context.mockServer.lastOptions()

  t.is(lastOptions.method, 'POST')
  t.deepEqual(lastOptions.headers, { 'Content-Type': 'application/x-www-form-urlencoded', Content: 'application/x-www-form-urlencoded' })

  for (const [key, value] of Object.entries(data)) {
    t.true(lastOptions.body.includes(key))
    t.true(lastOptions.body.includes(encodeURIComponent(value)))
  }

  t.true(lastOptions.body.includes('signature'))

  t.context.mockServer.reset()
})

test.serial('getCloudcheck works', async t => {
  t.context.mockServer.get('*', { body: { status: 200 } })

  const data = {
    key: 'myKey'
  }

  await getCloudcheck({
    path: '',
    data
  })

  const lastUrl = t.context.mockServer.lastUrl()

  for (const [key, value] of Object.entries(data)) {
    t.true(lastUrl.includes(key))
    t.true(lastUrl.includes(value))
  }

  t.true(lastUrl.includes('signature'))
})
